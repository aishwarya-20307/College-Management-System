const express = require('express');
const router = express.Router();
const Marks = require('../models/Marks');

// Get marks for a student
router.get('/:email', async (req, res) => {
  try {
    const marks = await Marks.find({ studentEmail: req.params.email });
    res.json({ marks });
  } catch(err) {
    console.error(err);
    res.status(500).json({ marks: [] });
  }
});

// Add marks (optional, admin use)
router.post('/add', async (req, res) => {
  const { studentEmail, course, internal, final } = req.body;
  try {
    const mark = new Marks({ studentEmail, course, internal, final });
    await mark.save();
    res.json({ success: true, message: 'Marks added successfully' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
