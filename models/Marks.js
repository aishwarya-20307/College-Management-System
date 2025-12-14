const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  course: { type: String, required: true },
  internal: { type: Number, required: true },
  final: { type: Number, required: true }
});

module.exports = mongoose.model('Marks', marksSchema);
