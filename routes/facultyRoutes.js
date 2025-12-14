const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Faculty = require('../models/facultyModel');

router.post('/', async (req, res) => {
    const { name, email, department } = req.body;

    if (!name || !email || !department) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(409).json({ message: "Faculty already exists." });
        }

        const defaultPassword = "12345"; 
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const newFaculty = new Faculty({
            name,
            email,
            department,
            password: hashedPassword
        });

        await newFaculty.save();
        res.json({ message: 'Faculty added successfully', newFaculty });

    } catch (err) {
        console.error("Faculty add error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
