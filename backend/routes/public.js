const router = require('express').Router();
const Department = require('../models/Department');
const Contact = require('../models/Contact');
const Grievance = require('../models/Grievance');
const { DISTRICTS, CATEGORIES, DEPARTMENTS } = require('../config/constants');

// GET /api/departments
router.get('/departments', async (req, res, next) => {
  try {
    const departments = await Department.find().sort('name').lean();
    if (departments.length) return res.json(departments);
    // Keep the public directory available even before optional demo seeding.
    res.json(DEPARTMENTS.map(({ keywords, ...department }) => ({ ...department, _id: department.code })));
  } catch (e) { next(e); }
});

// GET /api/meta  -> districts + categories for dropdowns
router.get('/meta', (req, res) => res.json({ districts: DISTRICTS, categories: CATEGORIES }));

// GET /api/public-stats  -> numbers for the home page
router.get('/public-stats', async (req, res, next) => {
  try {
    const [total, resolved] = await Promise.all([
      Grievance.countDocuments(),
      Grievance.countDocuments({ status: 'Resolved' })
    ]);
    const storedDepartments = await Department.countDocuments();
    res.json({ total, resolved, pending: total - resolved, departments: storedDepartments || DEPARTMENTS.length });
  } catch (e) { next(e); }
});

// POST /api/contact
router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) return res.status(400).json({ message: 'All fields are required' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });
    await Contact.create({ name, email, subject, message });
    res.status(201).json({ message: 'Thank you! Your message has been saved.' });
  } catch (e) { next(e); }
});

module.exports = router;
