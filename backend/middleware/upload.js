const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    // random name so users can't guess or overwrite files
    cb(null, crypto.randomBytes(12).toString('hex') + path.extname(file.originalname).toLowerCase());
  }
});

const allowed = ['image/jpeg', 'image/png', 'application/pdf'];

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only JPG, PNG or PDF files are allowed'));
  }
});
