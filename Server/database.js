const express = require("express");
const { Pool } = require("pg");
const app = express();
const PORT = 3000;

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "school_management",
  password: "magdanny",
  port: 5432,
});

Pool.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
app.use(express.json());

// Timetable route
app.get("/timetable", async (req, res) => {
  //   const classId = req.params.classId;

  try {
    const result = await pool.query("SELECT * FROM timetable");
    const timetableData = result.rows;
    res.status(200).json(timetableData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
// Example query to fetch data
const query =
  "SELECT class_id, day, period, subject, teacher FROM class_schedule";
client
  .query(query)
  .then((result) => {
    // Handle the query result here
    const rows = result.rows; // This contains the data

    // Close the database connection when done
    client
      .end()
      .then(() => {
        console.log("Database connection closed");
      })
      .catch((error) => {
        console.error("Error closing the database connection:", error);
      });

    // Pass the data to your React component
    // For simplicity, let's assume you're sending the data to a route
    // and serving it with Express
    app.get("/class-schedule", (req, res) => {
      res.json(rows);
    });
  })
  .catch((error) => {
    console.error("Error executing the query:", error);
  });
*/
