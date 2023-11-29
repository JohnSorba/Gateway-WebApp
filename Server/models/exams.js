const pool = require("../db");

// SUBJECT MODEL

const SubjectModel = {
  // Get all subjects
  async getAll() {
    const result = await pool.query("SELECT * FROM subjects");
    return result.rows;
  },

  // Add a subject
  async add(subjectName, subjectCode, classAssigned) {
    const query =
      "INSERT INTO subjects (subject_name, subject_code, class_assigned) VALUES ($1, $2, $3)";

    try {
      await pool.query(query, [subjectName, subjectCode, classAssigned]);
    } catch (error) {
      throw error;
    }
  },

  // Update a subject
  async update(subjectId, subjectDetails) {
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

  // Delete a subject
  async delete(subjectId) {
    // Database query to delete the subject based on subjectId

    const query = "DELETE FROM subjects WHERE id = $1";
    await pool.query(query, [subjectId]);
  },
};

//**************************************************** */
// QUESTION MODEL

const QuestionModel = {
  // Add a new question
  async create(subjectId, questionText, marks) {
    const query =
      "INSERT INTO questions (subject_code, question_text, marks) VALUES ($1, $2, $3) RETURNING *";

    const result = await pool.query(query, [subjectId, questionText, marks]);

    return result.rows[0];
  },

  // New add questions with options model function
  async addQuestion(subjectId, questionText, marks, options, correctOption) {
    try {
      const query =
        "INSERT INTO questions (subject_code, question_text, marks, correct_option) values ($1, $2, $3, $4) RETURNING *";

      const questionResult = await pool.query(query, [
        subjectId,
        questionText,
        marks,
        correctOption,
      ]);

      // Retrieve question id of newly created question
      const questionId = questionResult.rows[0].question_id;

      const optionsQuery =
        "INSERT INTO question_options (question_id, option_text) values ($1, $2)";

      // Loop over each option and add it to the question_options table
      for (let i = 0; i < options.length; i++) {
        await pool.query(optionsQuery, [questionId, options[i]]);
      }

      return "Question and options added successfully";
    } catch (error) {
      throw error;
    }
  },

  // ***************************************************
  // Get questions by subject
  async getAllQuestions() {
    const query = "SELECT * FROM questions";

    const result = await pool.query(query);

    return result.rows;
  },

  // Get questions by subject
  async getBySubject(subjectId) {
    const query = "SELECT * FROM questions WHERE subject_code = $1";

    const result = await pool.query(query, [subjectId]);

    return result.rows;
  },

  // Update a question
  async update(questionId, questionText) {
    const query =
      "UPDATE questions SET question_text = $1 WHERE question_id = $2 RETURNING *";

    const result = await pool.query(query, [questionText, questionId]);

    return result.rows[0];
  },

  // Delete a question
  async delete(questionId) {
    const query = "DELETE FROM questions WHERE question_id = $1";

    const result = pool.query(query, [questionId]);

    return result.rowCount;
  },
};

// QUESTION OPTIONS MODEL
const QuestionOptionsModel = {
  // Add options to a question
  async create(questionId, optionText, isCorrect) {
    const query =
      "INSERT INTO question_options (question_id, option_text, is_correct) VALUES ($1, $2, $3) RETURNING *";

    const result = pool.query(query, [questionId, optionText, isCorrect]);

    return result.rows;
  },

  // Get options by question
  async getByQuestion(questionId) {
    const query = "SELECT * FROM question_options WHERE question_id = $1";

    const result = await pool.query(query, [questionId]);

    return result.rows;
  },

  // Update an option
  async update(optionId, optionText, isCorrect) {
    const result = await pool.query(
      "UPDATE question_options SET option_text = $1, is_correct = $2 WHERE option_id = $3 RETURNING *",
      [optionText, isCorrect, optionId]
    );
    return result.rows[0];
  },

  // Delete an option
  async delete(optionId) {
    const query = "DELETE FROM question_options WHERE option_id = $1";
    const result = pool.query(query, [optionId]);

    return result.rowCount;
  },
};

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

const ExamModel = {
  // Create an exam
  async create(title) {
    const result = await pool.query(
      "INSERT INTO exams ( title) VALUES ($1) RETURNING *",
      [title]
    );
    return result.rows[0];
  },

  // Get all exam
  async getAllExams() {
    const result = await pool.query("SELECT * FROM exams");
    return result.rows;
  },

  // Get exam details
  async getById(examId) {
    const result = await pool.query("SELECT * FROM exams WHERE exam_id = $1", [
      examId,
    ]);
    return result.rows[0];
  },

  // Update an exam
  async update(examId, title) {
    const result = await pool.query(
      "UPDATE exams SET title = $1 WHERE exam_id = $2 RETURNING *",
      [title, examId]
    );
    return result.rows[0];
  },

  // Delete an exam
  async delete(examId) {
    const result = await pool.query("DELETE FROM exams WHERE exam_id = $1", [
      examId,
    ]);
    return result.rowCount;
  },
};

const ExamQuestionsModel = {
  // Add question to an exam
  async addQuestionsToExam(examId, questionIds) {
    const promises = questionIds.map((questionId) => {
      return pool.query(
        "INSERT INTO exam_questions (exam_id, question_id) VALUES ($1, $2)"[
          (examId, questionId)
        ]
      );
    });
    await Promise.all(promises);
    return { examId, added: questionIds.length };
  },

  // Get questions of an exam
  async getQuestionsByExam(examId) {
    const result = await pool.query(
      "SELECT q.* FROM question q INNER JOIN exam_questions eq ON q.question_id = eq.question_id WHERE eq.exam_id = $1",
      [examId]
    );
    return result.rows;
  },

  // Remove questions from an exam
  async removeQuestionFromExam(examId, questionId) {
    const result = await pool.query(
      "DELETE FROM exam_questions WHERE exam_id = $1 AND question_id = $2",
      [examId, questionId]
    );
    return result.rowCount;
  },
};

module.exports = {
  SubjectModel,
  QuestionModel,
  QuestionOptionsModel,
  ClassModel,
  ExamModel,
  ExamQuestionsModel,
};
