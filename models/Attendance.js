const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    studentEmail: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
