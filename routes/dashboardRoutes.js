const express = require("express");
const router = express.Router();

const Student = require("../models/studentModel");
const Faculty = require("../models/facultyModel");
const Course = require("../models/Course");
const Fees = require("../models/Fees");
const Attendance = require("../models/Attendance");

// GET Dashboard Stats
router.get("/stats", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalCourses = await Course.countDocuments();

    const pendingFees = await Fees.aggregate([
      { $match: { status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const attendanceData = await Attendance.aggregate([
      { $group: { _id: null, average: { $avg: "$percentage" } } }
    ]);

    res.json({
      totalStudents,
      totalFaculty,
      totalCourses,
      pendingFees: pendingFees[0]?.total || 0,
      attendancePercentage: attendanceData[0]?.average || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
});

module.exports = router;
