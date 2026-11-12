const router = require('express').Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: { message: 'Too many attempts, try later' } });

const makeToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, mobile: u.mobile, role: u.role, department: u.department });

// POST /api/auth/register  (citizens only - CMO/officers are created by seed/admin)
router.post('/register', loginLimiter, async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !mobile || !password) return res.status(400).json({ message: 'All fields are required' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });
    if (!/^[6-9]\d{9}$/.test(mobile)) return res.status(400).json({ message: 'Enter a valid 10 digit mobile number' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, mobile, password, role: 'citizen' });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
});

// POST /api/auth/login  (all roles)
router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await user.matchPassword(password || ''))) {
      return res.status(401).json({ message: 'Wrong email or password' });
    }
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;
