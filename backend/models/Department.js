const mongoose = require('mongoose');

module.exports = mongoose.model('Department', new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  category: String,
  description: String
}, { timestamps: true }));
