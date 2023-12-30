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

    const localDateString = (date) => {
      const retrievedDate = new Date(date);
      const localDateString = retrievedDate.toLocaleDateString();

      return localDateString;
    };

    // convert the received date (MM/DD/YYYY) into the database format (YYYY-MM-DD)
    const parts = attendanceDate.split("/");
    const postgresCompatibleDate = `${parts[2]}-${parts[0]}-${parts[1]}`;

    // Retrieve date from the attendance table
    const dateResult = await pool.query(
      "SELECT * FROM attendance WHERE attendance_date = $1 AND class_code = $2",
      [postgresCompatibleDate, classId]
    );

    // if record exists, check whether the date received as parameter matches any date in the database
    if (dateResult.rows.length > 0) {
      // store date value in variable
      const attendanceDatabaseDate = dateResult.rows[0].attendance_date;
      // convert date from database and date received from endpoint to the same format
      const databaseConverted = localDateString(attendanceDatabaseDate);
      const newAttendanceDate = localDateString(postgresCompatibleDate);

      // check if the date received matches any date in the database
      if (databaseConverted === newAttendanceDate) {
        return { type: "failure", message: "Today's entry updated already!" };
      }
    }

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
            postgresCompatibleDate,
            detail.attendanceStatus,
          ]);
        }

        await client.query("COMMIT");

        return {
          type: "success",
          message: `Attendance Record Created for today (${postgresCompatibleDate})`,
        };
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Attendance Record could not be added!", error);

        return {
          type: "failure",
          message: "Attendance Record could not be added!",
        };
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  },

  // get attendance record by date
  async getAttendanceByDate(classId) {
    const query = `
    SELECT 
      a.attendance_date AS date,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
      COUNT(*) AS totalStatus
    FROM
      attendance a
    JOIN 
      classes c ON c.class_code = a.class_code
    WHERE
      c.class_code = $1
    GROUP BY
      a.attendance_date, c.class_code
    ORDER BY
      a.attendance_date
  
      `;

    try {
      const result = await pool.query(query, [classId]);

      return result.rows;
    } catch (error) {
      console.error;

      throw error;
    }
  },

  // get attendance record by students
  async getAttendanceByStudents(classId) {
    const query = `
    SELECT 
      a.student_id, s.first_name, s.last_name,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
      COUNT(*) AS totalStatus
    FROM
      attendance a
    JOIN
      students s ON s.student_id = a.student_id
    JOIN 
      classes c ON c.class_code = a.class_code
    WHERE
      c.class_code = $1
    GROUP BY
      a.student_id, s.first_name, s.last_name, c.class_code
    ORDER BY
      a.student_id
  
      `;

    try {
      const result = await pool.query(query, [classId]);

      return result.rows;
    } catch (error) {
      console.error;

      throw error;
    }
  },

  // view attendance records
  async viewAttendanceRecords(classId, date) {
    const query = `
      SELECT a.*, s.first_name, s.last_name
      FROM attendance a
      JOIN students s ON s.student_id = a.student_id
      WHERE class_code = $1
      AND a.attendance_date = $2
    `;

    try {
      const result = await pool.query(query, [classId, date]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // view attendance records
  async viewDailyStudentsAttendance(classId, studentId) {
    const query = `
      SELECT a.student_id, a.attendance_date AS date, a.status
      FROM attendance a
      WHERE class_code = $1
      AND a.student_id = $2
    `;

    try {
      const result = await pool.query(query, [classId, studentId]);

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
