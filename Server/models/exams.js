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
  // Add a question with options model function
  async addQuestion(subjectId, questionText, marks, correctOption, options) {
    console.log("in model: ", options);
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
  // Get questiosn with options
  async getQuestionsWithOptions(questionId) {
    try {
      const questionsResult = await pool.query(
        "SELECT * FROM questions WHERE question_id = $1",
        [questionId]
      );
      const questions = questionsResult.rows;

      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const optionsResult = await pool.query(
            "SELECT * FROM question_options WHERE question_id = $1",
            [question.question_id]
          );
          const options = optionsResult.rows.map(
            (option) => option.option_text
          );

          return {
            subjectId: question.subject_code,
            questionText: question.question_text,
            options,
            correctOption: question.correct_option,
            marks: question.marks,
          };
        })
      );

      return questionsWithOptions;
    } catch (error) {
      throw error;
    }
  },

  // Get all questions
  async getAllQuestions() {
    const query = `SELECT questions.*, subjects.subject_name, subjects.class_assigned
    FROM questions
    JOIN subjects ON questions.subject_code = subjects.subject_code
    `;

    // WHERE questions.exam_id = {exam_id};
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
  async update(questionId, questionText, options) {
    const client = await pool.connect();

    try {
      // Start a transaction
      await client.query("BEGIN");

      const query =
        "UPDATE questions SET question_text = $1 WHERE question_id = $2 RETURNING *";

      await pool.query(query, [questionText, questionId]);

      // Clear existing options for the question
      await pool.query("DELETE FROM question_options WHERE question_id = $1", [
        questionId,
      ]);

      // Insert new options for the question
      const optionsQuery =
        "INSERT INTO question_options (question_id, option_text) VALUES($1, $2)";

      // Loop over each option and add it to the question_options table
      for (let i = 0; i < options.length; i++) {
        const result = await pool.query(optionsQuery, [questionId, options[i]]);
      }

      // Commit the transaction
      await client.query("COMMIT");

      return "Question updated Successfully";
    } catch (error) {
      // ROLLBACK the transaction incase of an error
      console.error(error);
      await client.query("ROLLBACK");
      throw error;
    } finally {
      // Release the client back to the pool
      client.release;
    }
  },

  // Delete a question
  async delete(questionId) {
    const client = await pool.connect();

    try {
      client.query("BEGIN");

      // Delete options associated with the question
      await pool.query("DELETE FROM question_options WHERE question_id = $1", [
        questionId,
      ]);

      // Delete the question itself
      await pool.query("DELETE FROM questions WHERE question_id = $1", [
        questionId,
      ]);

      // Commit the transaction
      client.query("COMMIT");

      return "Question and options deleted successfully";
    } catch (error) {
      // Rollback the transaction in case of an error
      client.query("ROLLBACK");

      console.error("Error Deleting Question", error);
      throw error;
    } finally {
      client.release;
    }
  },
};

// QUESTION OPTIONS MODEL
const QuestionOptionsModel = {
  // Add options to a question
  async create(questionId, options) {
    // const query =
    //   "INSERT INTO question_options (question_id, option_text) VALUES ($1, $2) RETURNING *";

    // const result = pool.query(query, [questionId, optionText]);

    const optionsQuery =
      "INSERT INTO question_options (question_id, option_text) values ($1, $2)";

    // Loop over each option and add it to the question_options table
    for (let i = 0; i < options.length; i++) {
      await pool.query(optionsQuery, [questionId, options[i]]);
    }

    // return result.rows;
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

  // Add Subjects to Exam
  async addExamSubjects(
    examId,
    subjectCode,
    date,
    startTime,
    duration,
    examType,
    numQuestions,
    teacherId
  ) {
    const query =
      "INSERT INTO exam_subjects (exam_id, subject_code, exam_date, start_time, duration, exam_type, no_of_questions, total_marks, teacher_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";

    try {
      const { rows: questions } = await pool.query(
        "SELECT * FROM questions WHERE subject_code = $1 LIMIT $2",
        [subjectCode, numQuestions]
      );

      // calculate the total marks
      const totalMarks = questions.reduce(
        (sum, question) => sum + question.marks,
        0
      );

      console.log(totalMarks);

      const result = await pool.query(query, [
        examId,
        subjectCode,
        date,
        startTime,
        duration,
        examType,
        numQuestions,
        totalMarks,
        teacherId,
      ]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Get all exam
  async getAllExams() {
    const result = await pool.query("SELECT * FROM exams");
    return result.rows;
  },

  // Get exam details
  async getById(examId) {
    const result = await pool.query(
      `SELECT exams.*, exam_subjects.*
      FROM exams 
      JOIN exam_subjects ON exam_subjects.exam_id = exams.exam_id
      WHERE exams.exam_id = $1`,
      [examId]
    );

    return result.rows;
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

  // Get questions with options
  async getQuestionsForExam(subjectId) {
    try {
      const questionsResult = await pool.query(
        "SELECT * FROM questions WHERE subject_code = $1",
        [subjectId]
      );
      const questions = questionsResult.rows;

      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const optionsResult = await pool.query(
            "SELECT * FROM question_options WHERE question_id = $1",
            [question.question_id]
          );
          const options = optionsResult.rows.map(
            (option) => option.option_text
          );

          return {
            subjectId: question.subject_code,
            questionText: question.question_text,
            options,
            correctOption: question.correct_option,
            marks: question.marks,
          };
        })
      );

      return questionsWithOptions;
    } catch (error) {
      throw error;
    }
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
