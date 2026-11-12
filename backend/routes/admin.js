const router = require('express').Router();
const Grievance = require('../models/Grievance');
const User = require('../models/User');
const { protect, allow } = require('../middleware/auth');

router.use(protect, allow('cmo'));

// GET /api/admin/stats  -> numbers + chart data
router.get('/stats', async (req, res, next) => {
  try {
    const now = new Date();
    const [total, resolved, overdue, byStatus, byDistrict, byCategory, byDepartment, unassigned] = await Promise.all([
      Grievance.countDocuments(),
      Grievance.countDocuments({ status: 'Resolved' }),
      Grievance.countDocuments({ dueDate: { $lt: now }, status: { $ne: 'Resolved' } }),
      Grievance.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Grievance.aggregate([{ $group: { _id: '$district', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Grievance.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Grievance.aggregate([
        { $match: { department: { $ne: null } } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'd' } },
        { $project: { _id: 0, name: { $arrayElemAt: ['$d.name', 0] }, count: 1 } },
        { $sort: { count: -1 } }
      ]),
      Grievance.countDocuments({ department: null })
    ]);
    const rename = (arr) => arr.map(x => ({ name: x._id, count: x.count }));
    res.json({
      total, resolved, pending: total - resolved, overdue, unassigned,
      awaitingReview: await Grievance.countDocuments({ 'actionReport.awaitingReview': true }),
      byStatus: rename(byStatus), byDistrict: rename(byDistrict),
      byCategory: rename(byCategory), byDepartment
    });
  } catch (e) { next(e); }
});

// GET /api/admin/officers?department=<id>  -> for the "assign officer" dropdown
router.get('/officers', async (req, res, next) => {
  try {
    const filter = { role: 'officer' };
    if (req.query.department) filter.department = req.query.department;
    res.json(await User.find(filter).select('name email department'));
  } catch (e) { next(e); }
});

module.exports = router;
