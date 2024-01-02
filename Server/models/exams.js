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
  // get classes for add question
  async getAddQuestionClasses() {
    const result = await pool.query("SELECT * FROM classes");

    return result.rows;
  },

  // get subjects based on class Id
  async getSubjectsPerClass(classId) {
    const result = await pool.query(
      "SELECT * FROM subjects WHERE class_assigned = $1",
      [classId]
    );

    return result.rows;
  },

  // Add a question with options model function
  async addQuestion(subjectId, questionText, marks, correctOption, options) {
    // Retrieve question to check if it matches new question (including non-case sensitive)
    const query =
      "SELECT COUNT(*) AS question_exists FROM questions WHERE LOWER(question_text) = LOWER($1) AND subject_code = $2";

    const matchCase = await pool.query(query, [questionText, subjectId]);
    const questionExists = matchCase.rows[0].question_exists > 0;

    if (questionExists) {
      console.log(questionExists);
      return {
        type: "failure",
        message: "Question Entry Matches Existing Record!",
      };
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const query =
        "INSERT INTO questions (subject_code, question_text, marks, correct_option) values ($1, $2, $3, $4) RETURNING *";

      const questionResult = await client.query(query, [
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
        await client.query(optionsQuery, [questionId, options[i]]);
      }

      await client.query("COMMIT");
      return {
        type: "success",
        message: "Question and options added successfully",
      };
    } catch (error) {
      return {
        type: "failure",
        message: "Cannot add new question in database!",
      };
    } finally {
      client.release;
    }
  },

  // ***************************************************
  // Get questiosn with options
  async getQuestionsWithOptions(questionId) {
    try {
      const questionsResult = await pool.query(
        `
        SELECT 
          q.*, s.subject_name 
        FROM 
          questions q
        JOIN subjects s ON s.subject_code = q.subject_code
        WHERE 
          question_id = $1`,
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
            subjectName: question.subject_name,
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
  async update(questionId, questionText, options, marks, correctOption) {
    const client = await pool.connect();

    try {
      // Start a transaction
      await client.query("BEGIN");

      const query =
        "UPDATE questions SET question_text = $1, marks = $2, correct_option = $3 WHERE question_id = $4 RETURNING *";

      await client.query(query, [
        questionText,
        marks,
        correctOption,
        questionId,
      ]);

      // Clear existing options for the question
      await client.query(
        "DELETE FROM question_options WHERE question_id = $1",
        [questionId]
      );

      // Insert new options for the question
      const optionsQuery =
        "INSERT INTO question_options (question_id, option_text) VALUES($1, $2)";

      // Loop over each option and add it to the question_options table
      for (let i = 0; i < options.length; i++) {
        await client.query(optionsQuery, [questionId, options[i]]);
      }

      // Commit the transaction
      await client.query("COMMIT");

      return {
        type: "success",
        message: "Question and Options updated Successfully",
      };
    } catch (error) {
      // ROLLBACK the transaction incase of an error
      console.error(error);
      await client.query("ROLLBACK");
      return {
        type: "failure",
        message: "Failed to Update Question and Options!",
      };
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

/******************************************** */
//  EXAM MODEL
const ExamModel = {
  // Create an exam
  async create(title) {
    const result = await pool.query(
      "INSERT INTO exams ( title) VALUES ($1) RETURNING *",
      [title]
    );
    return result.rows[0];
  },

  // fetch total questions for subject
  async totalQuestions(subjectId) {
    try {
      const result = await pool.query(
        "SELECT COUNT(*) FROM questions WHERE subject_code = $1",
        [subjectId]
      );

      return result.rows[0].count;
    } catch (error) {
      console.error(error);
      return {
        type: "failure",
        message: error,
      };
    }
  },

  // Add Subjects to Exam
  async addExamSubjects(
    examId,
    subjectCode,
    date,
    startTime,
    duration,
    numQuestions
  ) {
    const totalQuestions = Number(numQuestions);
    const numDuration = Number(duration);

    // check if subject exists in exam_subjects table
    const checkSubjectExists = await pool.query(
      "SELECT * FROM exam_subjects WHERE subject_code = $1 AND exam_id = $2",
      [subjectCode, examId]
    );

    // check if subject exists in exam already and show Warning
    if (checkSubjectExists.rows.length > 0) {
      return {
        type: "failure",
        message: `${subjectCode} exists in the current exam already!`,
      };
    }

    //////////////////////////////////////////////////////////////////////
    // query database for class of received subject
    const subjectClassQuery = await pool.query(
      "SELECT class_assigned from subjects where subject_code = $1",
      [subjectCode]
    );
    const subjectClass = subjectClassQuery.rows[0].class_assigned;

    // determine whether a class can have more than two subjects a day
    const twoSubjectsQuery = `
    SELECT 
      es.exam_id, es.exam_date, c.class_code
    FROM exam_subjects es
    JOIN subjects s on s.subject_code = es.subject_code
    JOIN classes c on c.class_code = s.class_assigned

    WHERE c.class_code = $1
    AND es.exam_id = $2
    AND es.exam_date = $3
      
    `;

    const twoSubjectsPerDay = await pool.query(twoSubjectsQuery, [
      subjectClass,
      examId,
      date,
    ]);

    if (twoSubjectsPerDay.rows.length >= 2) {
      return {
        type: "failure",
        message:
          "Each class is restricted to a maximum of two subjects per day!",
      };
    }
    //////////////////////////////////////////////////////////////////////

    // query database for results for current exam date, time and class
    const dateClashQuery = `
    SELECT 
      es.exam_id, es.subject_code, 
      es.exam_date, es.start_time, 
      es.start_time + (es.duration || ' minutes')::interval AS end_time, 
      c.class_code

    FROM exam_subjects es
    JOIN subjects s on s.subject_code = es.subject_code
    JOIN classes c on c.class_code = s.class_assigned

    WHERE c.class_code = $1
      AND es.exam_id = $2 
      AND es.exam_date= $3
      AND (
        ($4 >= es.start_time - INTERVAL '15 minutes' AND $4 < es.start_time + (es.duration + 45 || ' minutes')::interval) OR
        (es.start_time >= $4 - INTERVAL '15 minutes' AND es.start_time < $4 + ($5 + 45 || ' minutes')::interval)
      )
    `;

    const checkDateClash = await pool.query(dateClashQuery, [
      subjectClass,
      examId,
      date,
      startTime,
      duration,
    ]);
    console.log(checkDateClash.rows);

    console.log("---------------------------");

    // console.log(examDate, examTime, classId, subjectClass, date, startTime);

    // check if the date clashes
    if (checkDateClash.rows.length > 0) {
      return {
        type: "failure",
        message:
          "Schedule Conflict: A subject is scheduled for the specific date and time!",
      };
    }

    // get questions from question table with the specified subject code
    // and limited to the number of questions required
    const totalQuestionsResult = await pool.query(
      "SELECT * FROM questions WHERE subject_code = $1 LIMIT $2",
      [subjectCode, totalQuestions]
    );

    ///////////////////////////////////////////
    // set the returned array value we receive to a variable
    const questions = totalQuestionsResult.rows;

    // calculate the total marks
    const totalMarks = questions.reduce(
      (sum, question) => sum + question.marks,
      0
    );

    // Insert values received into the data base
    const query =
      "INSERT INTO exam_subjects (exam_id, subject_code, exam_date, start_time, duration, no_of_questions, total_marks) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";

    const client = pool.connect();
    try {
      (await client).query("BEGIN");
      await pool.query(query, [
        examId,
        subjectCode,
        date,
        startTime,
        numDuration,
        totalQuestions,
        totalMarks,
      ]);

      (await client).query("COMMIT");
      return { type: "success", message: "Subject added to Exam" };
    } catch (error) {
      (await client).query("ROLLBACK");
      return {
        type: "failure",
        message: error,
      };
    } finally {
      (await client).release;
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
      `SELECT e.*, es.*, s.subject_name, c.class_name
      FROM exams e
      JOIN exam_subjects es ON es.exam_id = e.exam_id
      JOIN subjects s ON s.subject_code = es.subject_code
      JOIN classes c ON c.class_code = s.class_assigned
      WHERE e.exam_id = $1
      ORDER BY es.exam_date 
      `,
      [examId]
    );

    return result.rows;
  },

  // fetch exam subject details for update
  async getExamSubjectDetails(examId, subjectId) {
    try {
      const result = await pool.query(
        `SELECT es.*, s.subject_name FROM exam_subjects es
        JOIN subjects s ON s.subject_code = es.subject_code
        WHERE es.subject_code = $1 AND es.exam_id = $2`,
        [subjectId, examId]
      );

      return result.rows[0];
    } catch (error) {
      console.error(error);
      return {
        type: "failure",
        message: error,
      };
    }
  },

  // Update subject in an exam
  async updateExamSubject(
    examId,
    subjectId,
    date,
    startTime,
    duration,
    noOfQuestions
  ) {
    //////////////////////////////////////////////////////////////////////
    const checkSubjectExists = await pool.query(
      "SELECT * FROM exam_subjects WHERE subject_code = $1 AND exam_id = $2",
      [subjectId, examId]
    );

    const dateQuery = checkSubjectExists.rows[0].exam_date;
    const newDateQuery = String(dateQuery);
    const timeQuery = checkSubjectExists.rows[0].start_time;
    const totalQuestionsQuery = checkSubjectExists.rows[0].no_of_questions;
    const durationQuery = checkSubjectExists.rows[0].duration;

    const queries = {
      date: dateQuery,
      time: timeQuery,
      totalQuestions: totalQuestionsQuery,
      duration: durationQuery,
    };

    const received = {
      date: dateQuery,
      time: timeQuery,
      totalQuestions: totalQuestionsQuery,
      duration: durationQuery,
    };

    if (queries == received) {
      console.log("queries = received");
    }

    console.log("------------------------");

    console.log("queries: ", queries);
    console.log("received: ", received);

    console.log("------------------------");
    console.log("date Query: ", typeof newDateQuery);
    console.log("time: ", typeof timeQuery);
    console.log("duration: ", typeof durationQuery);
    console.log("questions: ", typeof totalQuestionsQuery);
    console.log("------------------------");
    console.log("date received: ", typeof date);
    console.log("time: ", typeof startTime);
    console.log("duration: ", typeof duration);
    console.log("questions: ", typeof noOfQuestions);
    console.log("------------------------");

    console.log(date === newDateQuery);
    console.log(startTime === timeQuery);
    console.log(duration === durationQuery);
    console.log(noOfQuestions === totalQuestionsQuery);

    // check if subject exists in exam already and show Warning
    if (
      startTime === timeQuery &&
      duration === durationQuery &&
      noOfQuestions === totalQuestionsQuery
    ) {
      return {
        type: "failure",
        message: `No update for ${subjectId}!`,
      };
    }

    //////////////////////////////////////////////////////////////////////
    // query database for class of received subject
    const subjectClassQuery = await pool.query(
      "SELECT class_assigned from subjects where subject_code = $1",
      [subjectId]
    );
    const subjectClass = subjectClassQuery.rows[0].class_assigned;

    // determine whether a class can have more than two subjects a day
    const twoSubjectsQuery = `
    SELECT 
      es.exam_id, es.exam_date, c.class_code
    FROM exam_subjects es
    JOIN subjects s on s.subject_code = es.subject_code
    JOIN classes c on c.class_code = s.class_assigned

    WHERE c.class_code = $1
    AND es.exam_id = $2
    AND es.exam_date = $3
      
    `;

    const twoSubjectsPerDay = await pool.query(twoSubjectsQuery, [
      subjectClass,
      examId,
      date,
    ]);

    if (twoSubjectsPerDay.rows.length >= 2) {
      return {
        type: "failure",
        message:
          "Each class is restricted to a maximum of two subjects per day!",
      };
    }
    //////////////////////////////////////////////////////////////////////
    // query database for results for current exam date, time and class
    const dateClashQuery = `
      SELECT 
        es.exam_id, es.subject_code, 
        es.exam_date, es.start_time, 
        es.start_time + (es.duration || ' minutes')::interval AS end_time, 
        c.class_code

      FROM exam_subjects es
      JOIN subjects s on s.subject_code = es.subject_code
      JOIN classes c on c.class_code = s.class_assigned

      WHERE c.class_code = $1
        AND es.exam_id = $2 
        AND es.exam_date= $3
        AND (
          ($4 >= es.start_time - INTERVAL '15 minutes' AND $4 < es.start_time + (es.duration + 45 || ' minutes')::interval) OR
          (es.start_time >= $4 - INTERVAL '15 minutes' AND es.start_time < $4 + ($5 + 45 || ' minutes')::interval)
   )
 `;

    const checkDateClash = await pool.query(dateClashQuery, [
      subjectClass,
      examId,
      date,
      startTime,
      duration,
    ]);
    console.log(checkDateClash.rows);

    console.log("---------------------------");

    // console.log(examDate, examTime, classId, subjectClass, date, startTime);

    // check if the date clashes
    if (checkDateClash.rows.length > 0) {
      return {
        type: "failure",
        message:
          "Schedule Conflict: A subject is scheduled for the specific date and time!",
      };
    } else {
      return {
        type: "success",
        message: "Mock Update",
      };
    }
    //////////////////////////////////////////////////////////////////////

    // get questions from question table with the specified subject code
    // and limited to the number of questions required
    const totalQuestionsResult = await pool.query(
      "SELECT * FROM questions WHERE subject_code = $1 LIMIT $2",
      [subjectId, noOfQuestions]
    );

    // set the returned array value we receive to a variable
    const questions = totalQuestionsResult.rows;

    // calculate the total marks
    const totalMarks = questions.reduce(
      (sum, question) => sum + question.marks,
      0
    );

    const query = `
      UPDATE exam_subjects
      SET
        exam_date = $1,
        start_time = $2,
        duration = $3,
        no_of_questions = $4,
        total_marks = $5
        
      WHERE exam_id = $6
      AND subject_code = $7
    `;

    const client = pool.connect();
    try {
      (await client).query("BEGIN");

      await pool.query(query, [
        date,
        startTime,
        duration,
        noOfQuestions,
        totalMarks,
        examId,
        subjectId,
      ]);

      (await client).query("COMMIT");
      return {
        type: "success",
        message: `${subjectId} Updated Successfully!`,
      };
    } catch (error) {
      (await client).query("ROLLBACK");
      console.error(error);
      return {
        type: "failure",
        message: "Unable to update record in the database!",
      };
    } finally {
      (await client).release;
    }
  },

  // Delete a subjects from an exam
  async deleteExamSubject(examId, subjectId) {
    try {
      await pool.query(
        "DELETE FROM exam_subjects WHERE exam_id = $1 AND subject_code = $2",
        [examId, subjectId]
      );

      return {
        type: "success",
        message: "Subject Deleted From Exam Successfully!",
      };
    } catch (error) {
      console.error(error);
      return {
        type: "failure",
        message: "Failed to delete subject from exam!",
      };
    }
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
    try {
      await pool.query("DELETE FROM exam_subjects WHERE exam_id = $1", [
        examId,
      ]);
      await pool.query("DELETE FROM exams WHERE exam_id = $1", [examId]);

      return "Exam Deleted Successfully!";
    } catch (error) {
      console.error(error);

      throw error;
    }
  },

  async noOfQuestions(subjectId) {
    const query =
      "SELECT no_of_questions FROM exam_subjects WHERE subject_code = $1";

    await pool.query(query, [subjectId]);
  },

  // Get questions with options
  async getQuestionsForExam(subjectId, examId) {
    try {
      // get number of questions
      const result = await pool.query(
        "SELECT no_of_questions FROM exam_subjects WHERE subject_code = $1 AND exam_id = $2",
        [subjectId, examId]
      );

      const numQuestions = result.rows[0].no_of_questions;

      const questionsResult = await pool.query(
        `
        SELECT * from questions        
        WHERE subject_code = $1
        ORDER BY RANDOM()
        LIMIT $2
        `,
        [subjectId, numQuestions]
      );

      // ASSIGN RETRIEVED QUESTION TO questions VARIABLE
      const questions = questionsResult.rows;

      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          // map through each question and retrieve the options
          const optionsResult = await pool.query(
            "SELECT * FROM question_options WHERE question_id = $1",
            [question.question_id]
          );

          // store options in an array for each question
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

      return { questionsWithOptions, numQuestions };
    } catch (error) {
      throw error;
    }
  },
};

/*********************************************** */
//  EXAM QUESTIONS MODEL
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

////////////////////////
// STUDENT EXAMS MODEL
////////////////////////

const studentExamModel = {
  async getAllExams() {
    try {
      const result = await pool.query("SELECT * FROM exams");
      return result.rows;
    } catch (error) {
      console.log("Error fetching Exams:", error);
      throw error;
    }
  },

  // Get Class Exam
  async getByClassId(classId) {
    try {
      const result = await pool.query(
        `SELECT exams.exam_id, exams.title, exams.date_created, COUNT(exam_subjects.subject_code) AS numSubjects,
        subjects.class_assigned
      FROM 
        exams 
      LEFT JOIN 
        exam_subjects ON exams.exam_id = exam_subjects.exam_id 
      LEFT JOIN
        subjects ON exam_subjects.subject_code = subjects.subject_code
      WHERE subjects.class_assigned = $1
      
      GROUP BY
        exams.exam_id, subjects.class_assigned
      `,
        [classId]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Get exam details
  async getByStudentExamId(examId) {
    const result = await pool.query(
      `SELECT exams.*, exam_subjects.*
        FROM exams 
        JOIN exam_subjects ON exam_subjects.exam_id = exams.exam_id
        WHERE exams.exam_id = $1`,
      [examId]
    );

    return result.rows;
  },

  // Get exam details by classId
  async getExamDetailsByClassId(examId, classId, studentId) {
    const result = await pool.query(
      `SELECT exams.*, exam_subjects.*, subjects.*, student_exam_grades.*
        FROM 
          exams 
        JOIN 
          exam_subjects ON exams.exam_id = exam_subjects.exam_id
        JOIN
          subjects ON exam_subjects.subject_code = subjects.subject_code
        LEFT JOIN
          student_exam_grades ON exams.exam_id = student_exam_grades.exam_id
          AND exam_subjects.subject_code = student_exam_grades.subject_code
          AND student_exam_grades.student_id = $3
          
    
        WHERE exams.exam_id = $1 AND subjects.class_assigned = $2
        AND (student_exam_grades.completed = false OR student_exam_grades.completed IS NULL OR student_exam_grades.student_id IS NULL)
        `,
      [examId, classId, studentId]
    );

    console.log("result: ", result.rows);

    return result.rows;
  },

  async submitExamResult(
    studentId,
    examId,
    subjectId,
    marksObtained,
    isComplete
  ) {
    const submitGradeQuery =
      "INSERT INTO student_exam_grades (student_id, exam_id, subject_code, marks_obtained, completed) VALUES ($1, $2, $3, $4, $5)";

    // const client = pool.connect();
    try {
      await pool.query(submitGradeQuery, [
        studentId,
        examId,
        subjectId,
        marksObtained,
        isComplete,
      ]);

      return "You have successfully completed your exam!";
    } catch (error) {
      console.log(error);

      throw error;
    }
  },
};

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
  SubjectModel,
  QuestionModel,
  QuestionOptionsModel,
  ClassModel,
  ExamModel,
  ExamQuestionsModel,
  studentExamModel,
  AdminReportModel,
};
