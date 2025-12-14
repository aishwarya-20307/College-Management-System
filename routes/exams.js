const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

// Get all exams
router.get('/', async (req, res) => {
    try {
        const exams = await Exam.find();
        res.json(exams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add exam
router.post('/', async (req, res) => {
    const { name, course, date } = req.body;
    try {
        const newExam = new Exam({ name, course, date });
        await newExam.save();
        res.json({ message: 'Exam added successfully', newExam });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
