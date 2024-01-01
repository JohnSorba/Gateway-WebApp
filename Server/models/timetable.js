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
    const subjectCodeFormat = /^G\d{1,2}-[A-Z]{3,}$/;
    const isCodeValid = subjectCodeFormat.test(subjectCode);

    if (!isCodeValid) {
      return { type: "failure", message: "Invalid Subject Code Format!" };
    }

    // Check if subject code received exists in database
    const checkCodeExists = await pool.query(
      "SELECT * FROM subjects WHERE subject_code = $1",
      [subjectCode]
    );

    if (checkCodeExists.rows.length > 0) {
      return {
        type: "failure",
        message: `Subject Code '${subjectCode}' exists in your records!`,
      };
    }

    const client = await pool.connect();
    await client.query("BEGIN");

    try {
      const query =
        "INSERT INTO subjects (subject_name, subject_code, class_assigned) VALUES ($1, $2, $3)";

      const result = await client.query(query, [
        subjectName,
        subjectCode,
        classAssigned,
      ]);

      // Commit transaction
      await client.query("COMMIT");

      if (result) {
        return { type: "success", message: "Subject Added Successfully!" };
      } else {
        return {
          type: "failure",
          message: "Failed to add subject! Please Try Again.",
        };
      }
    } catch (error) {
      await client.query("ROLLBACK");
      return {
        type: "failure",
        message: "Failed to add subject! Please Try Again.",
      };
    } finally {
      client.release();
    }
  },

  async updateSubject(subjectId, subjectDetails) {
    // Database query to update the subject based on subjectId and subjectDetails
    const { subjectCode, subjectName } = subjectDetails;

    const subjectCodeFormat = /^G\d{1,2}-[A-Z]{3,}$/;
    const isCodeValid = subjectCodeFormat.test(subjectCode);

    if (!isCodeValid) {
      return { type: "failure", message: "Invalid Subject Code Format!" };
    }

    // Check if subject code received exists in database
    const checkCodeExists = await pool.query(
      "SELECT * FROM subjects WHERE subject_code = $1",
      [subjectCode]
    );

    const sameValue = checkCodeExists.rows[0];

    if (checkCodeExists.rows.length > 0) {
      if (
        sameValue.subject_code === subjectCode &&
        sameValue.subject_name === subjectName
      ) {
        return {
          type: "failure",
          message: "Invalid Update: No Changes Detected!",
        };
      } else {
        return {
          type: "failure",
          message: `Subject Code '${subjectCode}' exists. Please make another entry!`,
        };
      }
    }

    try {
      const query =
        "UPDATE subjects SET subject_code = $1, subject_name = $2 WHERE id = $3";

      await pool.query(query, [subjectCode, subjectName, subjectId]);

      return {
        type: "success",
        message: `${subjectName} Update Successfull!`,
      };
    } catch (error) {
      return { type: "failure", message: "Cannot update subject!" };
    }
  },

  async deleteSubject(subjectId) {
    // Database query to delete the subject based on subjectId

    const query = "DELETE FROM subjects WHERE subject_code = $1";
    await pool.query(query, [subjectId]);

    return { type: "success", message: "Subject Deleted Successfully!" };
  },
};

module.exports = { ClassModel, SubjectModel };
