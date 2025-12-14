const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a course
router.post('/', async (req, res) => {
    const { name, code } = req.body;
    try {
        const newCourse = new Course({ name, code });
        await newCourse.save();
        res.json({ message: 'Course added successfully', newCourse });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
