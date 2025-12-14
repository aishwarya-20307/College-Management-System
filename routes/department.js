const express = require('express');
const router = express.Router();
const Department = require('../models/departmentModel');

// Get all departments
router.get('/', async (req, res) => {
    try {
        const depts = await Department.find();
        res.json(depts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add department
router.post('/', async (req, res) => {
    const { name, code } = req.body;
    try {
        const dept = new Department({ name, code });
        await dept.save();
        res.json({ message: 'Department added successfully', dept });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
