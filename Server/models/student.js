const pool = require("../db");

const StudentModel = {
  async getStudentById(userId) {
    const query = `
    SELECT s.*, sa.*
    FROM students s
    JOIN student_admission sa
    ON s.student_id = sa.student_id
    WHERE user_id = $1`;

    const result = await pool.query(query, [userId]);

    return result.rows[0];
  },

  // get account information
  async getAccountInfo(userId) {
    const query = `
      SELECT * FROM user_accounts
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);

    return result.rows[0];
  },
};

const StudentAttendanceModel = {
  // get student attendance
  async getAttendance(studentId) {
    console.log("studentId: ", studentId);

    const statsQuery = `
    SELECT 
      a.student_id, s.first_name, s.last_name,
      COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS totalPresent,
      COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS totalAbsent,
      COUNT(*) AS totalStatus
    FROM
      attendance a
    JOIN
      students s ON s.student_id = a.student_id
    WHERE
      s.student_id = $1
    GROUP BY
      a.student_id, s.first_name, s.last_name
    ORDER BY
      a.student_id
  
      `;

    const query =
      "SELECT a.attendance_date, a.student_id, a.status FROM attendance a WHERE student_id = $1";

    try {
      const attQuery = await pool.query(query, [studentId]);
      const statsQueryResult = await pool.query(statsQuery, [studentId]);

      const attendanceData = attQuery.rows;
      const stats = statsQueryResult.rows[0];

      console.log({ attendanceData, stats });

      return { attendanceData, stats };
    } catch (error) {
      console.error(error);

      return "Cannot Retrieve Your Attendance Records from the Database!";
    }
  },
};

/////////////////////////////////////////////////
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
  async getExamsByClassId(classId, studentId) {
    const query = `
    SELECT e.*, COUNT(es.subject_code) AS totalSubjects,
      su.class_assigned
    FROM 
      exams e
    JOIN 
      exam_subjects es ON es.exam_id = e.exam_id
    JOIN
      subjects su ON su.subject_code = es.subject_code
    LEFT JOIN
      student_exam_grades seg 
    ON 
      e.exam_id = seg.exam_id
    AND
      es.subject_code = seg.subject_code
    AND 
      seg.student_id = $2

    WHERE su.class_assigned = $1 AND e.published = true
    AND (seg.completed = false OR seg.completed IS NULL OR seg.student_id IS NULL)

    GROUP BY
      e.exam_id, su.class_assigned
    `;

    try {
      const result = await pool.query(query, [classId, studentId]);

      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  // Get exam details by classId
  async getExamDetailsByClassIdAndStudentId(examId, classId, studentId) {
    const query = `
      SELECT e.*, es.*, su.*, seg.*
        FROM 
          exams e
        JOIN 
          exam_subjects es ON es.exam_id = e.exam_id
        JOIN
          subjects su ON su.subject_code = es.subject_code
        LEFT JOIN
          student_exam_grades seg 
          ON 
            seg.exam_id = e.exam_id
          AND
            seg.subject_code = seg.subject_code
          AND 
            seg.student_id = $3          
    
        WHERE e.exam_id = $1 AND su.class_assigned = $2
        AND (seg.completed = false OR seg.completed IS NULL OR seg.student_id IS NULL)
        `;

    try {
      const result = await pool.query(query, [examId, classId, studentId]);

      return result.rows;
    } catch (error) {
      console.log(error);
    }
  },

  // TAKE EXAM: Retrieve all questions with options
  async takeStudentExam(subjectId, examId) {
    try {
      // get number of questions
      const result = await pool.query(
        "SELECT no_of_questions FROM exam_subjects WHERE subject_code = $1 AND exam_id = $2",
        [subjectId, examId]
      );

      const numQuestions = result.rows[0].no_of_questions;

      const questionsResult = await pool.query(
        `
        SELECT q.*, su.subject_name
        FROM 
          questions q
        JOIN 
          subjects su ON su.subject_code = q.subject_code      
        WHERE 
          q.subject_code = $1

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
            subjectName: question.subject_name,
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

  async submitExamResult(
    studentId,
    examId,
    subjectId,
    marksObtained,
    isComplete,
    classCode
  ) {
    const submitGradeQuery =
      "INSERT INTO student_exam_grades (student_id, exam_id, subject_code, marks_obtained, completed, class_code) VALUES ($1, $2, $3, $4, $5, $6)";

    // const client = pool.connect();
    try {
      await pool.query(submitGradeQuery, [
        studentId,
        examId,
        subjectId,
        marksObtained,
        isComplete,
        classCode,
      ]);

      return {
        type: "success",
        failure: "You have successfully completed your exam!",
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  },
};

module.exports = { StudentModel, StudentAttendanceModel, studentExamModel };
