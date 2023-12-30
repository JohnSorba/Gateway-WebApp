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

const StudentAttendanceModel = {
  // get student attendance
  async getAttendance(studentId) {
    console.log("studentId: ", studentId);

    const statsQuery = `
    SELECT 
      a.student_id, s.first_name, s.last_name,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
      COUNT(*) AS totalStatus
    FROM
      attendance a
    JOIN
      students s ON s.student_id = a.student_id
    WHERE
      s.student_id = $1
    GROUP BY
      a.student_id, s.first_name, s.last_name
    ORDER BY
      a.student_id
  
      `;

    const query =
      "SELECT a.attendance_date, a.student_id, a.status FROM attendance a WHERE student_id = $1";

    try {
      const attQuery = await pool.query(query, [studentId]);
      const statsQueryResult = await pool.query(statsQuery, [studentId]);

      const attendanceData = attQuery.rows;
      const stats = statsQueryResult.rows[0];

      console.log({ attendanceData, stats });

      return { attendanceData, stats };
    } catch (error) {
      console.error(error);

      return "Cannot Retrieve Your Attendance Records from the Database!";
    }
  },
};

module.exports = { StudentModel, StudentAttendanceModel };
