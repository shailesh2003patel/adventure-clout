// server/models/Task.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  desc:        { type: String, default: '' },
  profession:  { type: String, default: 'general' }, // optional filter
  points:      { type: Number, default: 10 },         // points awarded
  difficulty:  { type: String, enum: ['easy','medium','hard'], default: 'easy' },
  isBonus:     { type: Boolean, default: false },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  active:      { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
