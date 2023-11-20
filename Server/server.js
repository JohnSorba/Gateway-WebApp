const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
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

// Authentication Requests
app.use("/auth", authRoutes);

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log("We are Live...");

/*
 *
 *
 *
 *
 **/
