const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const timetableRoutes = require("./routes/timetable");
const examRoutes = require("./routes/exams");
const studentRoutes = require("./routes/student");
const teacherRoutes = require("./routes/teachers");
const userRoutes = require("./routes/admin");
const pool = require("./db");
const { authenticateToken } = require("./middleware/authenticate");

// const { authenticateToken } = require("./middleware/authenticate");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Define a Route
app.get("/", (req, res) => {
  res.send("<h1>Hello, ES6 Express Server!</h1>");
});

app.get("/api/students", async (req, res) => {
  try {
    // Query the database
    const result = await pool.query(
      `SELECT students.*, student_admission.*, class_name 
      FROM students 
      JOIN student_admission 
      ON students.student_id = student_admission.student_id 
      JOIN classes 
      ON classes.class_code = student_admission.class_code`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching student data: ", err);
  }
});

app.use("/user/", studentRoutes);

app.use("/users", userRoutes);

// Authentication Requests
app.use("/auth", authRoutes);

// Timetable Routes
app.use("/timetable", timetableRoutes);

// Exam Routes
app.use("/exams", examRoutes);

// Student Routes
app.use("/student", studentRoutes);

// Teacher Routes
app.use("/teacher", teacherRoutes);

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("-----------------------------------");
});

console.log("We are Live...");
