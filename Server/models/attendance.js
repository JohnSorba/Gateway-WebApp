const pool = require("../db");

const AttendanceModel = {
  async getAttendance() {
    try {
      const result = await pool.query("SELECT * FROM attendance");

      return result.rows;
    } catch (error) {
      console.error(error);
    }
  },
};

module.exports = { AttendanceModel };
