const express = require("express");
const app = express();
const pool = require("./db");

const bodyParser = require("body-parser");
const cors = require("cors");
const studentRoutes = require("./student/routes");
// const jwtMiddleware = require("./middleware/jwt");

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
