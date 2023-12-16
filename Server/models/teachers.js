const pool = require("../db");

const TeacherModel = {
  async getTeacherById(userId) {
    const query = `
    SELECT t.*, td.*, class_code
        FROM teachers t
        JOIN teacher_employee_details td
        ON t.teacher_id = td.teacher_id
        JOIN teacher_classes tc
        ON t.teacher_id = tc.teacher_id
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

  // get timetable
  async getTimetable(classId) {
    const query = "SELECT * FROM ";
  },
};

module.exports = { TeacherModel };
//https://i.pravatar.cc/300?u=194533
