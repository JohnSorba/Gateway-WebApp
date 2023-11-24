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
    console.log(`Fetching subjects for class ${classCode}`);
    console.log(classCode);

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

module.exports = { ClassModel };
