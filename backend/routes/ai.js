const router = require('express').Router();
const { protect, allow } = require('../middleware/auth');
const { analyzeComplaint } = require('../services/aiService');

// POST /api/ai/analyze   body: { description, district }
// Returns SUGGESTIONS only. The citizen reviews them before submitting.
router.post('/analyze', protect, allow('citizen', 'cmo'), async (req, res, next) => {
  try {
    const { description, district } = req.body;
    if (!description || description.trim().length < 20) {
      return res.status(400).json({ message: 'Please write at least 20 characters' });
    }
    res.json(await analyzeComplaint(description.trim(), district));
  } catch (e) { next(e); }
});

module.exports = router;
