const pool = require("../db");

// const TimetableModel = {
//   // Function to add timetable entry
//   async addTimetableEntry(classId, subjectId, teacherId, periodId, day) {
//     const query = `INSERT INTO Timetable (class_code, subject_code, teacher_id, period_id, day) VALUES ($1, $2, $3, $4, $5)`;
//     await pool.query(query, [classId, subjectId, teacherId, periodId, day]);
//   },
// };

const ClassModel = {
  async getSubjectsPerClass(classCode) {
    const query = "SELECT * FROM subjects WHERE class_assigned = $1";

    try {
      const result = await pool.query(query, [classCode]);
      //   console.log("Query result:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error in getSubjectsPerClass:", error);
      throw error; // rethrow the error so it can be caught by the controller
    }
  },
};

const SubjectModel = {
  async addSubject(subjectName, subjectCode, classAssigned) {
    const query =
      "INSERT INTO subjects (subject_name, subject_code, class_assigned) VALUES ($1, $2, $3)";

    try {
      await pool.query(query, [subjectName, subjectCode, classAssigned]);
    } catch (error) {
      throw error;
    }
  },

  async updateSubject(subjectId, subjectDetails) {
    // Database query to update the subject based on subjectId and subjectDetails
    const { subjectCode, subjectName } = subjectDetails;

    const query =
      "UPDATE subjects SET subject_code = $1, subject_name = $2 WHERE id = $3";

    try {
      await pool.query(query, [subjectCode, subjectName, subjectId]);
    } catch (error) {
      throw error;
    }
  },

  async deleteSubject(subjectId) {
    // Database query to delete the subject based on subjectId

    const query = "DELETE FROM subjects WHERE id = $1";
    await pool.query(query, [subjectId]);
  },
};

module.exports = { ClassModel, SubjectModel };
