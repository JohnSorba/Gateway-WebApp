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

const TeacherAttendanceModel = {
  // Retrieve class students
  async getStudentsByClass(classId) {
    const query = `
      SELECT s.student_id, s.first_name, s.last_name
      FROM students s
      JOIN student_admission sa ON sa.student_id = s.student_id
      JOIN classes c ON c.class_code = sa.class_code
      WHERE c.class_code = $1
    `;

    try {
      const result = await pool.query(query, [classId]);

      return result.rows;
    } catch (error) {
      console.log(error);

      throw error;
    }
  },

  // add attendance
  async addAttendanceStatus(attendanceDetails) {
    const { classId, attendanceDate, details } = attendanceDetails;

    const query =
      "INSERT INTO attendance (student_id, class_code, attendance_date, status) VALUES ($1, $2, $3, $4)";

    try {
      const client = await pool.connect();
      await client.query("BEGIN");

      try {
        // loop through each element in the detail array and add the accompanying classId and date
        for (const detail of details) {
          await client.query(query, [
            detail.studentId,
            classId,
            attendanceDate,
            detail.attendanceStatus,
          ]);
        }

        await client.query("COMMIT");

        return `Attendance Record Created for today ${attendanceDate}`;
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Attendance Record could not be added!", error);

        return "Attendance Record could not be added!";
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  },

  // view attendance records
  async viewAttendanceRecords(classId) {
    const query = `
      SELECT a.*, s.first_name, s.last_name
      FROM attendance a
      JOIN students s ON s.student_id = a.student_id
      WHERE class_code = $1
    `;

    try {
      const result = await pool.query(query, [classId]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // view attendance record by student id
  async viewStudentAttendance(studentId) {
    try {
      const result = await pool.query(
        "SELECT * FROM attendance WHERE student_id = $1",
        [studentId]
      );

      return result.rows;
    } catch (error) {
      console.log("Error fetching student attendance");
    }
  },
};

module.exports = { TeacherModel, TeacherAttendanceModel };
//https://i.pravatar.cc/300?u=194533
