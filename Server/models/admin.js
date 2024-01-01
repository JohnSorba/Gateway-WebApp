const pool = require("../db");

const AdminDashboardModel = {
  // get stats
  async getStats() {
    const studentQuery = `
      SELECT DISTINCT s.first_name, s.last_name, s.parent_name, s.parent_contact, c.class_code, AVG(seg.marks_obtained)

      FROM students s
      JOIN student_admission sa ON s.student_id = sa.student_id
      JOIN classes c ON c.class_code = sa.class_code
      LEFT JOIN student_exam_grades seg ON seg.student_id = s.student_id
      WHERE seg.completed = true
      GROUP BY seg.student_id, s.first_name, s.last_name, s.parent_name, s.parent_contact, c.class_code
      LIMIT 5
    `;

    const teacherQuery = `
    SELECT t.teacher_id, t.first_name, t.last_name, t.gender, t.phone_number, tc.class_code
    FROM teachers t
    JOIN teacher_classes tc ON t.teacher_id = tc.teacher_id
    LIMIT 5
    `;

    try {
      // get number of total students in the school
      const studentResult = await pool.query("SELECT COUNT(*) FROM students");
      const teacherResult = await pool.query("SELECT COUNT(*) FROM teachers");
      const attendanceResult = await pool.query(
        "SELECT COUNT(*) FROM attendance"
      );

      // const attendanceResult = await pool.query(
      //   "SELECT COUNT(*) FROM attendance WHERE status = $1",
      //   ["present"]
      // );

      const studentCount = studentResult.rows[0].count;
      const teacherCount = teacherResult.rows[0].count;
      const attendanceCount = attendanceResult.rows[0].count;

      //////// Student and Teacher Data for display in table
      const studentDataResult = await pool.query(studentQuery);
      const teacherDataResult = await pool.query(teacherQuery);
      const studentData = studentDataResult.rows;
      const teacherData = teacherDataResult.rows;

      // get the ratio of boys to girls in the schools
      const maleResult = await pool.query(
        "SELECT COUNT(*) FROM students WHERE gender = $1",
        ["Male"]
      );
      const femaleResult = await pool.query(
        "SELECT COUNT(*) FROM students WHERE gender = $1",
        ["Female"]
      );

      const maleCount = Number(maleResult.rows[0].count);
      const femaleCount = Number(femaleResult.rows[0].count);

      // Student Gender Pie Chart Data
      const genderCountData = [
        { name: "Boys", value: maleCount, color: "#0088FE" },
        { name: "Girls", value: femaleCount, color: "#FF8042" },
      ];

      return {
        studentCount,
        teacherCount,
        attendanceCount,
        studentData,
        teacherData,
        genderCountData,
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  },
};

const UserAccountsModel = {
  // Retrieve all
  async getAllUsers() {
    const query = `
    SELECT 
    ua.user_id,
    ua.username, 
    ua.email, 
    r.role_name, 
    s.first_name AS sfirstName,
    s.last_name AS slastName,
    sa.admission_status,
    sa.admission_date,
    t.first_name AS tfirstName,
    t.last_name AS tlastName,
    ted.joining_date,
    ted.employee_status

        FROM user_accounts ua

    LEFT JOIN roles r ON r.role_id = ua.role_id
    LEFT JOIN students s ON s.user_id = ua.user_id
    LEFT JOIN student_admission sa ON sa.student_id = s.student_id
    LEFT JOIN teachers t ON t.user_id = ua.user_id
    LEFT JOIN teacher_employee_details ted ON t.teacher_id = ted.teacher_id

    WHERE ua.role_id <> 1
    `;

    const result = await pool.query(query);
    // console.log(result.rows);
    return result.rows;
  },

  // Delete user
  async deleteUser(userId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Delete dependent records
      // Delete from student_attendance
      await client.query(
        "DELETE FROM attendance WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1)",
        [userId]
      );
      // Delete from student_admission
      await client.query(
        "DELETE FROM student_admission WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1)",
        [userId]
      );
      // delete from student_exam_grades
      await client.query(
        "DELETE FROM student_exam_grades WHERE student_id = (SELECT student_id FROM students WHERE user_id = $1)",
        [userId]
      );
      await client.query("DELETE FROM students WHERE user_id = $1", [userId]);

      //////////////////////////////////////
      // Handle deleting teacher information
      await client.query(
        "DELETE FROM teacher_classes WHERE teacher_id = (SELECT teacher_id from teachers WHERE user_id = $1)",
        [userId]
      );
      await client.query(
        "DELETE FROM teacher_employee_details WHERE teacher_id = (SELECT teacher_id from teachers WHERE user_id = $1)",
        [userId]
      );
      await client.query("DELETE FROM teachers WHERE user_id = $1", [userId]);

      // Delete user from the main users table
      await client.query("DELETE FROM user_accounts WHERE user_id  = $1", [
        userId,
      ]);

      // Commit the transaction if everything is successful
      await client.query("COMMIT");

      return { type: "success", message: "User Deleted Successfully!" };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting user:", error);
      return { type: "failure", message: "Unable to Delete User!" };
    } finally {
      client.release();
    }
  },
};

const StudentDetailsModel = {
  // Get all student info
  async getAllStudentInfo() {
    const query = `
    SELECT s.first_name, s.last_name, s.student_id, s.age, s.gender, class_name, profile_photo 
    FROM students s
    JOIN student_admission sa
    ON sa.student_id = s.student_id
    JOIN classes c
    ON c.class_code = sa.class_code
    `;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error) {
      console.log("cannot retrieve student details");

      throw error;
    }
  },

  // Get student info
  async getStudentInfo(studentId) {
    const query = `
    SELECT s.*, sa.*, c.* 
    FROM students s
    JOIN student_admission sa
    ON sa.student_id = s.student_id
    JOIN classes c
    ON c.class_code = sa.class_code
    WHERE s.student_id = $1
    `;

    try {
      const result = await pool.query(query, [studentId]);

      return result.rows;
    } catch (error) {
      console.log("cannot retrieve student details");

      throw error;
    }
  },
};

const TeacherDetailsModel = {
  // Get all teacher info
  async getAllTeacherInfo() {
    const query = `
    SELECT t.first_name, t.last_name, t.teacher_id, t.gender, class_name, ted.profile_photo
    FROM 
      teachers t
    JOIN 
      teacher_employee_details ted
    ON
      ted.teacher_id = t.teacher_id
    JOIN
      teacher_classes tc
    ON 
      tc.teacher_id = t.teacher_id
    JOIN 
      classes c ON c.class_code = tc.class_code
    `;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error) {
      console.log("cannot retrieve student details");

      throw error;
    }
  },

  // Get student info
  async getTeacherInfo(teacherId) {
    const query = `
    SELECT t.*, ted.*, tc.*, c.*
    FROM teachers t
    JOIN teacher_employee_details ted
    ON t.teacher_id = ted.teacher_id
    JOIN teacher_classes tc
    ON tc.teacher_id = t.teacher_id
    JOIN classes c ON c.class_code = tc.class_code
    WHERE t.teacher_id = $1
    `;

    try {
      const result = await pool.query(query, [teacherId]);

      return result.rows;
    } catch (error) {
      console.log("cannot retrieve teacher details");

      throw error;
    }
  },
};

module.exports = {
  UserAccountsModel,
  StudentDetailsModel,
  TeacherDetailsModel,
  AdminDashboardModel,
};
