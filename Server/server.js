require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./db");

const bodyParser = require("body-parser");
const cors = require("cors");
const studentRoutes = require("./student/routes");
const { authenticateToken } = require("./student/controllers/auth");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Define a Route
app.get("/", (req, res) => {
  res.send("Hello, ES6 Express Server!");
});

//get all pupils
app.use("/pupils", (req, res) => {
  pool.query("SELECT * FROM pupils", (error, results) => {
    if (error) throw error;
    res.status(200).json(results.rows);
  });
});

// Example of a protected route
app.get("/protected", authenticateToken, (req, res) => {
  if (req.user.role === "admin") {
    console.log("This is the admin private route");
  }
});

// Student Requests
app.use("/auth", studentRoutes);

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
 *
 *
 *
 *
 **/
