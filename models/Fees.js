const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  totalFees: { type: Number, required: true },
  feesPaid: { type: Number, default: 0 },
  balance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Fees", feesSchema);
