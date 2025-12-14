const express = require("express");
const router = express.Router();

const Student = require("../models/studentModel");
const Faculty = require("../models/facultyModel");
const Attendance = require("../models/Attendance");
const Exam = require("../models/Exam");
const Fees = require("../models/Fees");
const Course = require("../models/Course");
const auth = require("../middleware/authMiddleware");
const log = (message) => console.log(`[${new Date().toISOString()}] ${message}`);

// ------------------ Dashboard ------------------
router.get("/dashboard", auth, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFaculty = await Faculty.countDocuments();
    const totalCourses = await Course.countDocuments();

    // Fees pending calculation
    const feesPendingAgg = await Student.aggregate([
      { $project: { pending: { $subtract: ["$totalFees", "$feesPaid"] } } },
      { $group: { _id: null, totalPending: { $sum: "$pending" } } }
    ]);

    // Attendance percentage
    const attendanceRecords = await Attendance.find();
    const presentCount = attendanceRecords.filter(a => a.status === "Present").length;
    const attendancePercentage = attendanceRecords.length
      ? (presentCount / attendanceRecords.length) * 100
      : 0;

    res.json({
      totalStudents,
      totalFaculty,
      totalCourses,
      feesPending: feesPendingAgg[0]?.totalPending || 0,
      attendancePercentage: attendancePercentage.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Department-wise Students ------------------
router.get("/students/department/:department", async (req, res) => {
  try {
    const department = req.params.department;
    const students = await Student.find({ department });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Individual Student Report ------------------
router.get("/student/:studentId/report", auth, async (req, res) => {
  try {
    const studentId = req.params.studentId;
    // Prevent students from accessing other students' reports
    if(req.user.role === "student" && req.user.id !== studentId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Attendance
    const attendanceRecords = await Attendance.find({ studentId });
    const totalAttendance = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(a => a.status === "Present").length;
    const attendancePercentage = totalAttendance
      ? (presentCount / totalAttendance) * 100
      : 0;

    // Exams
    const exams = await Exam.find({ studentId });
    let totalInternal = 0;
    let totalExternal = 0;
    exams.forEach(e => {
      totalInternal += e.internalMarks || 0;
      totalExternal += e.externalMarks || 0;
    });
    // ------------------ Get All Courses ------------------
router.get("/courses", auth, async (req, res) => {
  try {
    log(`Courses requested by user: ${req.user.id} (${req.user.role})`);
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    log(`Courses fetch error: ${err.message}`);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// ------------------ Get Single Course by ID ------------------
router.get("/courses/:id", auth, async (req, res) => {
  try {
    const courseId = req.params.id;
    log(`Course ${courseId} requested by user: ${req.user.id}`);
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    log(`Course fetch error: ${err.message}`);
    res.status(500).json({ message: "Failed to fetch course" });
  }
});


    // Fees
    const fees = await Fees.findOne({ studentId });

    res.json({
      student,
      attendance: { total: totalAttendance, present: presentCount, percentage: attendancePercentage.toFixed(2) },
      marks: { internal: totalInternal, external: totalExternal },
      fees: fees || {}
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Attendance Routes ------------------
router.get("/attendance", auth, async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/attendance/date/:date", auth, async (req, res) => {
  try {
    const dateParam = req.params.date;
    const start = new Date(dateParam);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateParam);
    end.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({ date: { $gte: start, $lte: end } });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/attendance/percentage/:studentId",auth ,async (req, res) => {
  try {
    const studentId = req.params.studentId;
    // Restrict student access
    if(req.user.role === "student" && req.user.id !== studentId) {
      return res.status(403).json({ message: "Forbidden" });
  }

    const total = await Attendance.countDocuments({ studentId });
    const present = await Attendance.countDocuments({ studentId, status: "Present" });
    const percentage = total ? (present / total) * 100 : 0;
    res.json({ studentId, total, present, percentage: percentage.toFixed(2) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Exams Routes ------------------
router.put("/exams/update-marks/:studentId", auth , async (req, res) => {
  if(req.user.role !== "faculty") {
    return res.status(403).json({ message: "Only faculty can update marks" });
  }
  try {
    const studentId = req.params.studentId;
    const exams = await Exam.find({ studentId });

    let totalInternal = 0;
    let totalExternal = 0;
    exams.forEach(e => {
      totalInternal += e.internalMarks || 0;
      totalExternal += e.externalMarks || 0;
    });

    const student = await Student.findByIdAndUpdate(
      studentId,
      { marks: { internal: totalInternal, external: totalExternal } },
      { new: true }
    );

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Fees Routes ------------------
router.get("/fees", auth, async (req, res) => {
  if(req.user.role === "student") {
    const fees = await Fees.find({ studentId: req.user.id });
    return res.json(fees);
  }
  try {
    const fees = await Fees.find();
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/fees/:id", auth, async (req, res) => {
  if(req.user.role !== "faculty") {
    return res.status(403).json({ message: "Only faculty can update fees" });
  }
  try {
    const updatedFees = await Fees.findByIdAndUpdate(
      req.params.id,
      { feesPaid: req.body.feesPaid },
      { new: true }
    );
    res.json(updatedFees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Department-wise Dashboard ------------------
router.get("/dashboard/department-stats", auth, async (req, res) => {
  try {
    const departments = await Student.distinct("department");
    const stats = [];

    for (const dept of departments) {
      const totalStudents = await Student.countDocuments({ department: dept });

      const feesPendingAggDept = await Student.aggregate([
        { $match: { department: dept } },
        { $project: { pending: { $subtract: ["$totalFees", "$feesPaid"] } } },
        { $group: { _id: null, totalPending: { $sum: "$pending" } } }
      ]);
      const feesPending = feesPendingAggDept[0]?.totalPending || 0;

      const studentsInDept = await Student.find({ department: dept });
      const studentIds = studentsInDept.map(s => s._id.toString());
      const attendanceRecords = await Attendance.find({ studentId: { $in: studentIds } });
      const presentCount = attendanceRecords.filter(a => a.status === "Present").length;
      const attendancePercentage = attendanceRecords.length
        ? (presentCount / attendanceRecords.length) * 100
        : 0;

      stats.push({
        department: dept,
        totalStudents,
        feesPending,
        attendancePercentage: attendancePercentage.toFixed(2)
      });
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ Course-wise Dashboard ------------------
router.get("/dashboard/course-stats", auth, async (req, res) => {
  try {
    const courses = await Course.find();
    const stats = [];

    for (const course of courses) {
      const studentsInCourse = await Student.find({ course: course._id });
      const studentIds = studentsInCourse.map(s => s._id.toString());
      const totalStudents = studentsInCourse.length;

      const feesPendingAggCourse = await Student.aggregate([
        { $match: { course: course._id } },
        { $project: { pending: { $subtract: ["$totalFees", "$feesPaid"] } } },
        { $group: { _id: null, totalPending: { $sum: "$pending" } } }
      ]);
      const feesPending = feesPendingAggCourse[0]?.totalPending || 0;

      const attendanceRecords = await Attendance.find({ studentId: { $in: studentIds } });
      const presentCount = attendanceRecords.filter(a => a.status === "Present").length;
      const attendancePercentage = attendanceRecords.length
        ? (presentCount / attendanceRecords.length) * 100
        : 0;

      stats.push({
        course: course.name,
        totalStudents,
        feesPending,
        attendancePercentage: attendancePercentage.toFixed(2)
      });
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
