const pool = require("../db");

// ADMISSION CLASS FETCH CONTROLLER
const admissionClass = async (req, res) => {
  try {
    // Execute a raw SQL query to fetch classes from the database
    const query = "SELECT * FROM classes"; // Replace 'classes' with your actual table name
    const result = await pool.query(query);

    // Check if there are rows in the result
    if (result.rows.length === 0) {
      res.status(404).json({ error: "No classes found" });
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Error fetching classes" });
  }
};

module.exports = {
  admissionClass,
};
