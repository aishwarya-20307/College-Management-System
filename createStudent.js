const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Student = require("./models/studentModel"); // note the correct file name

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/cmisDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error(err));

async function createStudent() {
  const hashedPassword = await bcrypt.hash("123456", 10);
  await Student.create({
    name: "John Doe",
    email: "john@example.com",
    password: hashedPassword
  });
  console.log("Student created!");
  mongoose.disconnect(); // close the connection
}

createStudent();
