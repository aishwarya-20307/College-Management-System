console.log("Starting CMIS backend...");

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");           // <-- import bcrypt
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cmis";

// ===================
// Middleware
// ===================
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ===================
// MongoDB Connection
// ===================
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ===================
// Models
// ===================
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Faculty model
const Faculty = require("./models/facultyModel");

// Exam/Marks schema
const examSchema = new mongoose.Schema({
  email: { type: String, required: true },
  course: { type: String, required: true },
  internal: { type: Number, required: true },
  final: { type: Number, required: true },
});
const Exam = mongoose.model("Exam", examSchema);

// ===================
// Routes
// ===================

// Faculty routes
const facultyRoutes = require('./routes/facultyRoutes');
app.use('/api/faculty', facultyRoutes);

// Attendance and Student routes (if you have them)
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/students", require("./routes/studentRoutes"));

// Test route
app.get("/", (req, res) => {
  res.send("CMIS Backend is running!");
});

// ===================
// Auth Routes
// ===================

// Register
app.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);  // <-- hash password
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Registration successful. You can now login." });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password); // <-- compare hashed
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ email, token: "fake-jwt-token" }); // Replace with real JWT later
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================
// Dashboard / Marks (unchanged)
// ===================
app.get("/dashboard", (req, res) => {
  res.json({
    totalStudents: 120,
    totalFaculty: 10,
    totalCourses: 8,
    feesPending: 25000,
    attendancePercentage: 92
  });
});

app.get("/marks", async (req, res) => {
  const userEmail = req.query.email;
  try {
    const marks = await Exam.find({ email: userEmail });
    if (!marks.length) return res.status(404).json({ message: "Marks not found" });
    res.json(marks);
  } catch (err) {
    console.error("Get marks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/all-marks", async (req, res) => {
  try {
    const allMarks = await Exam.find({});
    res.json(allMarks);
  } catch (err) {
    console.error("Get all marks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/marks", async (req, res) => {
  const { email, course, internal, final } = req.body;

  if (!email || !course || internal == null || final == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newMark = new Exam({ email, course, internal, final });
    await newMark.save();
    res.json({ message: "Marks added successfully!" });
  } catch (err) {
    console.error("Add marks error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
