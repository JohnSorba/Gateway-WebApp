const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

// Routes for accessing resources from the database
const authRoutes = require("./routes/auth");
const attendanceRoutes = require("./routes/attendance");
const timetableRoutes = require("./routes/timetable");
const examRoutes = require("./routes/exams");
const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");
const teacherRoutes = require("./routes/teachers");
const userRoutes = require("./routes/admin");
const reportRoutes = require("./routes/reports");

const pool = require("./db");
const { authenticateToken } = require("./middleware/authenticate");

// const { authenticateToken } = require("./middleware/authenticate");

// Responsible for connection to frontend
app.use(cors());

// Ensures data sent is in the right format
app.use(bodyParser.json());
app.use(express.json());

// Admin Routes
app.use("/admin", adminRoutes);
app.use("/user/", studentRoutes);

app.use("/users", userRoutes);

// Authentication Requests
app.use("/auth", authRoutes);

// Timetable Routes
app.use("/timetable", timetableRoutes);

// Attendance Routes
app.use("/attendance", attendanceRoutes);

// Exam Routes
app.use("/exams", examRoutes);

// Student Routes
app.use("/student", studentRoutes);

// Teacher Routes
app.use("/teacher", teacherRoutes);

// Report Routes
app.use("/admin/report", reportRoutes);

// Define a Route
app.get("/", (req, res) => {
  res.send("<h1>Hello, ES6 Express Server!</h1>");
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("-----------------------------------");
});

console.log("We are Live...");
