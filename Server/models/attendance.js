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

  // get attendance record by date
  async getAllAttendanceByDate() {
    const query = `
    SELECT 
      a.attendance_date AS date,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
      COUNT(*) AS totalStatus
    FROM
      attendance a
    GROUP BY
      a.attendance_date
    ORDER BY
      a.attendance_date desc
    `;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error) {
      console.error;

      throw error;
    }
  },

  // get attendance record by students
  async getAllAttendanceByStudents() {
    const query = `
    SELECT 
      a.student_id, s.first_name, s.last_name, c.class_name,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
      COUNT(*) AS totalStatus
    FROM
      attendance a
    JOIN
      students s ON s.student_id = a.student_id
    JOIN
    classes c ON c.class_code = a.class_code
    GROUP BY
      a.student_id, s.first_name, s.last_name, c.class_name, c.class_code
    ORDER BY
      s.last_name
  
      `;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error) {
      console.error;

      throw error;
    }
  },

  // get attendance record by students
  async getAllAttendanceByClasses() {
    const query = `
    SELECT 
      a.class_code, c.class_name,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
      COUNT(*) AS totalStatus
    FROM
      attendance a
    JOIN
      classes c ON c.class_code = a.class_code
    GROUP BY
      c.class_code, a.class_code, c.class_name
    ORDER BY
      c.class_code
  
      `;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error) {
      console.error;

      throw error;
    }
  },

  // view attendance records
  async getAllClassAttendanceByDate(date) {
    const query = `
      SELECT a.class_code, c.class_name,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
      COUNT(*) AS totalStatus
      FROM 
        attendance a
      JOIN 
        classes c ON c.class_code = a.class_code
      WHERE 
        a.attendance_date = $1
     GROUP BY
        c.class_code, a.class_code, c.class_name
      ORDER BY
        c.class_code
    `;

    try {
      const result = await pool.query(query, [date]);

      return result.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // view attendance records for student in a class on a specific date
  async getStudentAttendanceByClassAndDate(classId, date) {
    const query = `
      SELECT a.student_id, a.status, s.first_name, s.last_name
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

  // view attendance records for student in a class on a specific date
  async getClassAttendanceDetails(classId) {
    const query = `
    SELECT 
        a.student_id, s.first_name, s.last_name,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
        COUNT(*) AS totalStatus
    FROM
        attendance a
    JOIN students s
    ON 
        s.student_id = a.student_id
    WHERE 
        class_code = $1
    GROUP BY
        a.student_id, s.first_name, s.last_name
    ORDER BY
        a.student_id
    `;

    try {
      const result = await pool.query(query, [classId]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // view attendance records for specific student
  async getStudentAttendanceDetails(studentId) {
    const query = `
    SELECT attendance_date AS date, status
    FROM attendance
	WHERE student_id = $1
    `;

    try {
      const result = await pool.query(query, [studentId]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

const AttendanceChartModel = {
  // get attendance chart data

  async getAttendanceChartData() {
    const query = `
      SELECT
        TO_CHAR(a.attendance_date::timestamp, 'YYYY-MM-DD') AS date,
        CAST(SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS integer) AS totalPresent,
        CAST(SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS integer) AS totalAbsent
      FROM 
        attendance a
    GROUP BY
        a.attendance_date
    ORDER BY
        a.attendance_date desc
    LIMIT 5
     
    `;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = { AttendanceModel, AttendanceChartModel };
