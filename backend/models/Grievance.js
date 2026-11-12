const mongoose = require('mongoose');
const { STATUSES, PRIORITIES } = require('../config/constants');

const ref = (name) => ({ type: mongoose.Schema.Types.ObjectId, ref: name });

// Grievance history: every status change with timestamp + responsible user
const historySchema = new mongoose.Schema({
  action: String,                       // e.g. "Status changed", "Forwarded", "Action report submitted"
  status: String,
  remark: String,
  by: ref('User'),
  byName: String,
  byRole: String,
  at: { type: Date, default: Date.now }
}, { _id: false });

// Department assignments (each forward by the CMO is one record)
const assignmentSchema = new mongoose.Schema({
  department: ref('Department'),
  officer: ref('User'),
  assignedBy: ref('User'),
  remark: String,
  at: { type: Date, default: Date.now }
}, { _id: false });

const attachmentSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  mimetype: String,
  size: Number
}, { _id: false });

const grievanceSchema = new mongoose.Schema({
  refId: { type: String, unique: true, index: true },
  citizen: { ...ref('User'), required: true },
  district: { type: String, required: true },
  category: { type: String, required: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  priority: { type: String, enum: PRIORITIES, default: 'Medium' },
  status: { type: String, enum: STATUSES, default: 'Submitted' },
  dueDate: Date,
  escalated: { type: Boolean, default: false },

  department: ref('Department'),       // current department
  officer: ref('User'),                // current officer (optional)
  assignments: [assignmentSchema],

  // AI output is only a SUGGESTION - kept for audit, humans decide
  aiSuggestion: {
    department: String, category: String, priority: String, summary: String,
    source: String, note: String,
    possibleDuplicates: [String],
    acceptedByCitizen: Boolean
  },

  attachments: [attachmentSchema],
  history: [historySchema],
  internalRemarks: [{ text: String, by: ref('User'), byName: String, at: { type: Date, default: Date.now } }],

  actionReport: { text: String, by: ref('User'), at: Date, awaitingReview: { type: Boolean, default: false } },
  feedback: { rating: Number, comment: String, at: Date }
}, { timestamps: true, toJSON: { virtuals: true } });

grievanceSchema.virtual('isOverdue').get(function () {
  return !!this.dueDate && this.status !== 'Resolved' && this.dueDate < new Date();
});

module.exports = mongoose.model('Grievance', grievanceSchema);
