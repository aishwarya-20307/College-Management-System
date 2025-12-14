const express = require('express');
const router = express.Router();
const Student = require('../Models/studentModel');

// =========================
// REGISTER STUDENT
// =========================
router.post('/register', async (req, res) => {
    const { name, email, password, course } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(409).json({ message: "Student already exists" });
        }

        const newStudent = new Student({ name, email, password, course });
        await newStudent.save();

        res.json({ message: "Student registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// =========================
// STUDENT LOGIN
// =========================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    try {
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await student.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            message: "Login successful",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                course: student.course
            },
            token: "fake-jwt-token"
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// =========================
// GET ALL STUDENTS
// =========================
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// =========================
// GET STUDENT BY ID
// =========================
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
