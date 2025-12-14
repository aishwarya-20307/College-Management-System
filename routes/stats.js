const express = require('express');
const router = express.Router();
const Student = require('../models/studentModel');
const Marks = require('../models/Marks');
const Faculty = require('../models/facultyModel');
const Course = require('../models/Course');

router.get('/', async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalFaculty = await Faculty.countDocuments();
        const totalCourses = await Course.countDocuments();
        const feesPending = await Student.aggregate([
            { $group: { _id: null, total: { $sum: "$feesPending" } } }
        ]);
        const attendance = await Student.aggregate([
            { $group: { _id: null, avgAttendance: { $avg: "$attendance" } } }
        ]);

        res.json({
            totalStudents,
            totalFaculty,
            totalCourses,
            feesPending: feesPending[0] ? feesPending[0].total : 0,
            attendance: attendance[0] ? attendance[0].avgAttendance.toFixed(2) : 0
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
