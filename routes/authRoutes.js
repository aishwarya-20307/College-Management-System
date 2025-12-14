// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const JWT_SECRET = process.env.JWT_SECRET || "CMIS_SECRET_KEY";

// ====== Models ======
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const examSchema = new mongoose.Schema({
    email: { type: String, required: true },
    course: { type: String, required: true },
    internal: { type: Number, required: true },
    final: { type: Number, required: true }
});
const Exam = mongoose.model("Exam", examSchema);

// ====== Auth Routes ======

// Register
router.post("/register", async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (!email || !password || !confirmPassword)
        return res.status(400).json({ message: "All fields are required" });
    if (password !== confirmPassword)
        return res.status(400).json({ message: "Passwords do not match" });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(409).json({ message: "User already exists. Please login." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "Registration successful. You can now login." });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token, email: user.email });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Add marks
router.post("/marks", async (req, res) => {
    const { email, course, internal, final } = req.body;
    if (!email || !course || internal == null || final == null)
        return res.status(400).json({ message: "All fields are required" });

    try {
        const newMark = new Exam({ email, course, internal, final });
        await newMark.save();
        res.json({ message: "Marks added successfully!" });
    } catch (err) {
        console.error("Add marks error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// View marks
router.get("/marks", async (req, res) => {
    const { email } = req.query;
    try {
        const marks = await Exam.find({ email });
        if (!marks.length) return res.status(404).json({ message: "Marks not found" });
        res.json(marks);
    } catch (err) {
        console.error("Get marks error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
