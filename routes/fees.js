const express = require('express');
const router = express.Router();
const Fees = require('../models/Fees');

// Get all fees records
router.get('/', async (req, res) => {
    try {
        const fees = await Fees.find();
        res.json(fees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add fees record
router.post('/', async (req, res) => {
    const { studentEmail, amount, paid } = req.body;
    try {
        const fee = new Fees({ studentEmail, amount, paid });
        await fee.save();
        res.json({ message: 'Fees record added successfully', fee });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
