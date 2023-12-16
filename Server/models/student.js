const pool = require("../db");

const StudentModel = {
  async getStudentById(userId) {
    const query = `
    SELECT s.*, sa.*
    FROM students s
    JOIN student_admission sa
    ON s.student_id = sa.student_id
    WHERE user_id = $1`;

    const result = await pool.query(query, [userId]);

    return result.rows[0];
  },

  // get account information
  async getAccountInfo(userId) {
    const query = `
      SELECT * FROM user_accounts
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);

    return result.rows[0];
  },
};

module.exports = { StudentModel };
