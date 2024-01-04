const pool = require("../db");
//////////////////////////////////////////////

const AdminReportModel = {
  // Get report by exam

  async getAllExamResult() {
    const query = `
      SELECT DISTINCT e.*, seg.completed 
      FROM student_exam_grades seg
      JOIN exams e
      ON e.exam_id = seg.exam_id
      WHERE seg.completed = true`;

    try {
      const result = await pool.query(query);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  // Get report result
  async getAllStudentResult(examId) {
    const query = `
      SELECT seg.student_id, AVG(seg.marks_obtained) AS average_grade, s.first_name, s.last_name, su.class_assigned 
      FROM student_exam_grades seg
      JOIN students s ON s.student_id = seg.student_id
      LEFT JOIN subjects su ON su.subject_code = seg.subject_code
      WHERE seg.exam_id = $1
      GROUP BY seg.student_id, s.first_name, s.last_name, su.class_assigned
  
      `;

    try {
      const result = await pool.query(query, [examId]);
      // console.log(result.rows);

      return result.rows;
    } catch (error) {
      console.log("Cannot display all student results");
      throw error;
    }
  },

  // Get Individaul Student Result
  async getStudentResultById(studentId, examId) {
    const query = `
      SELECT seg.*, e.title, e.date_created, s.first_name, s.last_name, s.age, su.*
      FROM student_exam_grades seg
      JOIN exams e ON e.exam_id = seg.exam_id
      JOIN students s
      ON s.student_id = seg.student_id
      LEFT JOIN subjects su
      ON su.subject_code = seg.subject_code
      WHERE seg.student_id = $1 AND seg.exam_id = $2
  
      `;

    try {
      const result = await pool.query(query, [studentId, examId]);
      // console.log("in get by student ID: ", result.rows);

      return result.rows;
    } catch (error) {
      console.log("Cannot display Individual results");
      throw error;
    }
  },

  ////// IN STUDENT PANEL
  // Get by student id
  async getByStudentId(studentId) {
    const query = `
      SELECT seg.*, s.first_name, s.last_name, su.* 
      FROM student_exam_grades seg
      JOIN students s
      ON s.student_id = seg.student_id
      LEFT JOIN subjects su
      ON su.subject_code = seg.subject_code
      WHERE seg.student_id = $1
  
      `;

    try {
      const result = await pool.query(query, [studentId]);
      // console.log(result.rows);

      return result.rows;
    } catch (error) {
      console.log("Cannot display results");
      throw error;
    }
  },
};

module.exports = {
  AdminReportModel,
};
