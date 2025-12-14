const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Get all attendance records
router.get('/', async (req, res) => {
    try {
        const records = await Attendance.find();
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add attendance
router.post('/', async (req, res) => {
    const { studentEmail, course, percentage } = req.body;
    try {
        const record = new Attendance({ studentEmail, course, percentage });
        await record.save();
        res.json({ message: 'Attendance added successfully', record });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
