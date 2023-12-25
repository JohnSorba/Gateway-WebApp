const pool = require("../db");

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
    t.first_name AS tfirstName,
    t.last_name AS tlastName,
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
    console.log(result.rows);
    return result.rows;
  },

  // Delete user
  async deleteUser(userId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Delete dependent records
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

      return "User Deleted Successfully!";
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error deleting user:", error);
      return "Unable to Delete User!";
    } finally {
      client.release();
    }
  },
};

module.exports = { UserAccountsModel };
