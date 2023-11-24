const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const timetableRoutes = require("./routes/timetable");
const pool = require("./db");

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
    const result = await pool.query("SELECT * FROM students");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching student data: ", err);
  }
});

// Fetch Subjects by class
app.get("/api/subjects/:classCode", async (req, res) => {
  const classCode = req.params.classCode;

  try {
    const result = await pool.query(
      `select * from subjects where class_assigned = $1`,
      [classCode]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.log("Error fetching subjects: ", error);
  }
});

app.get("/api/test", (req, res) => {
  res.json({ message: "test response" });
});

// Authentication Requests
app.use("/auth", authRoutes);

// Timetable Creation Routes
// app.use("/timetable", timetableRoutes);
app.use("/timetable", timetableRoutes);

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("-----------------------------------");
});

console.log("We are Live...");

/*
 *
 *
 *
 *
 **/
