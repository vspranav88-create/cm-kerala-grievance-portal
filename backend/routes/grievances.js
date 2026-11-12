const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Grievance = require('../models/Grievance');
const Department = require('../models/Department');
const User = require('../models/User');
const { protect, allow } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { STATUSES, PRIORITIES, DISTRICTS, CATEGORIES } = require('../config/constants');

const DAYS_TO_RESOLVE = { High: 7, Medium: 15, Low: 30 };
const POPULATE = [
  { path: 'department', select: 'name code' },
  { path: 'officer', select: 'name email' },
  { path: 'citizen', select: 'name email mobile' }
];

// ---------- helpers ----------
function addHistory(g, user, action, remark) {
  g.history.push({ action, status: g.status, remark, by: user._id, byName: user.name, byRole: user.role });
}

// Who is allowed to see this grievance?
function canView(user, g) {
  if (user.role === 'cmo') return true;
  if (user.role === 'citizen') return String(g.citizen) === String(user._id);
  if (user.role === 'officer') return !!g.department && String(g.department) === String(user.department);
  return false;
}

// Remove fields a role should not see
function clean(g, user) {
  const obj = g.toJSON();
  if (user.role === 'citizen') {
    delete obj.internalRemarks; delete obj.actionReport; delete obj.aiSuggestion; delete obj.assignments;
  }
  if (user.role === 'officer') delete obj.internalRemarks;
  return obj;
}

async function loadAndCheck(req, res) {
  const g = await Grievance.findById(req.params.id);
  if (!g) { res.status(404).json({ message: 'Grievance not found' }); return null; }
  if (!canView(req.user, g)) { res.status(403).json({ message: 'Not allowed' }); return null; }
  return g;
}

async function newRefId() {
  for (let i = 0; i < 5; i++) {
    const id = 'CMK' + new Date().getFullYear() + '-' + crypto.randomInt(100000, 999999);
    if (!(await Grievance.exists({ refId: id }))) return id;
  }
  throw new Error('Could not generate reference number');
}

// ---------- 1. Submit (citizen) ----------
// POST /api/grievances  (multipart/form-data, optional file field "attachment")
router.post('/', protect, allow('citizen'), upload.single('attachment'), async (req, res, next) => {
  try {
    const { district, category, subject, description, priority } = req.body;
    if (!district || !category || !subject || !description) return res.status(400).json({ message: 'Please fill all required fields' });
    if (!DISTRICTS.includes(district)) return res.status(400).json({ message: 'Invalid district' });
    if (!CATEGORIES.includes(category)) return res.status(400).json({ message: 'Invalid category' });
    if (description.length < 20) return res.status(400).json({ message: 'Description is too short' });

    let ai = {};
    try { ai = JSON.parse(req.body.aiSuggestion || '{}'); } catch (e) { /* ignore bad json */ }
    const finalPriority = PRIORITIES.includes(priority) ? priority : (PRIORITIES.includes(ai.priority) ? ai.priority : 'Medium');

    const g = new Grievance({
      refId: await newRefId(),
      citizen: req.user._id, district, category, subject: subject.trim(), description: description.trim(),
      priority: finalPriority,
      dueDate: new Date(Date.now() + DAYS_TO_RESOLVE[finalPriority] * 86400000),
      aiSuggestion: ai.department ? {
        department: ai.department, category: ai.category, priority: ai.priority, summary: ai.summary,
        source: ai.source, note: ai.note, possibleDuplicates: ai.possibleDuplicates || [],
        acceptedByCitizen: ai.category === category && ai.priority === finalPriority
      } : undefined
    });
    if (req.file) {
      g.attachments.push({ originalName: req.file.originalname, filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size });
    }
    addHistory(g, req.user, 'Grievance submitted', 'Submitted by citizen');
    await g.save();
    res.status(201).json({ message: 'Grievance submitted', refId: g.refId, id: g._id });
  } catch (e) { next(e); }
});

// ---------- 2. Track by reference number (public, limited info) ----------
// GET /api/grievances/track/:refId
router.get('/track/:refId', async (req, res, next) => {
  try {
    const g = await Grievance.findOne({ refId: req.params.refId.trim().toUpperCase() }).populate('department', 'name');
    if (!g) return res.status(404).json({ message: 'No grievance found with this reference number' });
    res.json({
      refId: g.refId, subject: g.subject, district: g.district, category: g.category,
      status: g.status, department: g.department ? g.department.name : 'Not yet assigned',
      createdAt: g.createdAt,
      history: g.history.map(h => ({ action: h.action, status: h.status, remark: h.remark, at: h.at }))
    });
  } catch (e) { next(e); }
});

// ---------- 3. List (role based) ----------
// GET /api/grievances?district=&category=&priority=&status=&overdue=true&q=
router.get('/', protect, async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'citizen') filter.citizen = req.user._id;
    if (req.user.role === 'officer') filter.department = req.user.department;

    const { district, category, priority, status, overdue, q } = req.query;
    if (district) filter.district = district;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
    if (overdue === 'true') { filter.dueDate = { $lt: new Date() }; filter.status = { $ne: 'Resolved' }; }
    if (q) {
      const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex chars
      filter.$or = [{ refId: new RegExp(safe, 'i') }, { subject: new RegExp(safe, 'i') }];
    }
    const list = await Grievance.find(filter).populate(POPULATE).sort('-createdAt').limit(500);
    res.json(list.map(g => clean(g, req.user)));
  } catch (e) { next(e); }
});

// ---------- 4. Single grievance ----------
router.get('/:id', protect, async (req, res, next) => {
  try {
    const g = await loadAndCheck(req, res); if (!g) return;
    await g.populate(POPULATE);
    res.json(clean(g, req.user));
  } catch (e) { next(e); }
});

// ---------- 5. Download attachment (checks permission first) ----------
router.get('/:id/attachments/:filename', protect, async (req, res, next) => {
  try {
    const g = await loadAndCheck(req, res); if (!g) return;
    const file = g.attachments.find(a => a.filename === req.params.filename);
    if (!file) return res.status(404).json({ message: 'File not found' });
    const full = path.join(__dirname, '..', 'uploads', file.filename);
    if (!fs.existsSync(full)) return res.status(404).json({ message: 'File missing on server' });
    res.type(file.mimetype).sendFile(full);
  } catch (e) { next(e); }
});

// ---------- 6. CMO: forward / assign to department ----------
// PUT /api/grievances/:id/assign   body: { departmentId, officerId?, remark?, priority?, category? }
router.put('/:id/assign', protect, allow('cmo'), async (req, res, next) => {
  try {
    const g = await loadAndCheck(req, res); if (!g) return;
    const dept = await Department.findById(req.body.departmentId);
    if (!dept) return res.status(400).json({ message: 'Select a valid department' });
    let officer = null;
    if (req.body.officerId) {
      officer = await User.findOne({ _id: req.body.officerId, role: 'officer', department: dept._id });
      if (!officer) return res.status(400).json({ message: 'Officer does not belong to that department' });
    }
    // CMO can correct the AI's category/priority
    if (CATEGORIES.includes(req.body.category)) g.category = req.body.category;
    if (PRIORITIES.includes(req.body.priority)) g.priority = req.body.priority;

    g.department = dept._id;
    g.officer = officer ? officer._id : undefined;
    g.assignments.push({ department: dept._id, officer: officer && officer._id, assignedBy: req.user._id, remark: req.body.remark });
    g.status = 'In Progress';
    g.actionReport = undefined;
    addHistory(g, req.user, 'Forwarded to ' + dept.name, req.body.remark || 'Forwarded by CMO');
    await g.save();
    await g.populate(POPULATE);
    res.json(clean(g, req.user));
  } catch (e) { next(e); }
});

// ---------- 7. Update status ----------
// PUT /api/grievances/:id/status   body: { status, remark }
// CMO can set any status. Officer can only set "In Progress". Citizens use /reopen.
router.put('/:id/status', protect, allow('cmo', 'officer'), async (req, res, next) => {
  try {
    const g = await loadAndCheck(req, res); if (!g) return;
    const { status, remark } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    if (req.user.role === 'officer' && status !== 'In Progress') {
      return res.status(403).json({ message: 'Officers can only mark In Progress. Submit an action report for resolution.' });
    }
    if (req.user.role === 'officer' && !remark) return res.status(400).json({ message: 'Please add an investigation remark' });
    g.status = status;
    addHistory(g, req.user, 'Status changed to ' + status, remark);
    await g.save();
    await g.populate(POPULATE);
    res.json(clean(g, req.user));
  } catch (e) { next(e); }
});

// ---------- 8. CMO: internal remark / escalate ----------
router.post('/:id/remarks', protect, allow('cmo'), async (req, res, next) => {
  try {
    const g = await loadAndCheck(req, res); if (!g) return;
    if (!req.body.text) return res.status(400).json({ message: 'Remark is empty' });
    g.internalRemarks.push({ text: req.body.text, by: req.user._id, byName: req.user.name });
    await g.save();
    res.status(201).json({ internalRemarks: g.internalRemarks });
  } catch (e) { next(e); }
});

router.put('/:id/escalate', protect, allow('cmo'), async (req, res, next) => {
  try {
    const g = await loadAndCheck(req, res); if (!g) return;
    g.escalated = true; g.priority = 'High';
    addHistory(g, req.user, 'Escalated', req.body.remark || 'Escalated due to delay');
    await g.save();
    res.json({ message: 'Escalated', escalated: true });
  } catch (e) { next(e); }
});

// ---------- 9. Officer: submit action-taken report ----------
router.post('/:id/action-report', protect, allow('officer'), async (req, res, next) => {
  try {
    const g = await loadAndCheck(req, res); if (!g) return;
    if (!req.body.text || req.body.text.length < 10) return res.status(400).json({ message: 'Write the action taken (min 10 characters)' });
    g.actionReport = { text: req.body.text, by: req.user._id, at: new Date(), awaitingReview: true };
    addHistory(g, req.user, 'Action-taken report submitted to CMO', 'Awaiting CMO review');
    await g.save();
    res.json({ message: 'Report submitted to CMO', actionReport: g.actionReport });
  } catch (e) { next(e); }
});

// ---------- 10. CMO: review the department's report ----------
// PUT /api/grievances/:id/review   body: { decision: "resolve" | "sendback", remark }
router.put('/:id/review', protect, allow('cmo'), async (req, res, next) => {
  try {
    const g = await loadAndCheck(req, res); if (!g) return;
    if (!g.actionReport || !g.actionReport.awaitingReview) return res.status(400).json({ message: 'No action report waiting for review' });
    const { decision, remark } = req.body;
    if (!['resolve', 'sendback'].includes(decision)) return res.status(400).json({ message: 'decision must be resolve or sendback' });
    g.actionReport.awaitingReview = false;
    g.status = decision === 'resolve' ? 'Resolved' : 'In Progress';
    addHistory(g, req.user, decision === 'resolve' ? 'Resolved after CMO review' : 'Sent back to department', remark);
    await g.save();
    await g.populate(POPULATE);
    res.json(clean(g, req.user));
  } catch (e) { next(e); }
});

// ---------- 11. Citizen: feedback + reopen ----------
router.post('/:id/feedback', protect, allow('citizen'), async (req, res, next) => {
  try {
    const g = await loadAndCheck(req, res); if (!g) return;
    const rating = Number(req.body.rating);
    if (g.status !== 'Resolved') return res.status(400).json({ message: 'Feedback is allowed only after resolution' });
    if (g.feedback && g.feedback.rating) return res.status(400).json({ message: 'Feedback already submitted' });
    if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ message: 'Rating must be 1 to 5' });
    g.feedback = { rating, comment: req.body.comment || '', at: new Date() };
    await g.save();
    res.status(201).json({ feedback: g.feedback });
  } catch (e) { next(e); }
});

router.post('/:id/reopen', protect, allow('citizen'), async (req, res, next) => {
  try {
    const g = await loadAndCheck(req, res); if (!g) return;
    if (g.status !== 'Resolved') return res.status(400).json({ message: 'Only resolved grievances can be reopened' });
    if (!req.body.remark) return res.status(400).json({ message: 'Please tell us why you are reopening' });
    g.status = 'Reopened';
    g.dueDate = new Date(Date.now() + DAYS_TO_RESOLVE[g.priority] * 86400000);
    g.feedback = undefined;
    addHistory(g, req.user, 'Reopened by citizen', req.body.remark);
    await g.save();
    res.json({ message: 'Grievance reopened', status: g.status });
  } catch (e) { next(e); }
});

module.exports = router;
