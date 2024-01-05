const {
  StudentModel,
  StudentAttendanceModel,
  studentExamModel,
} = require("../models/student");

const StudentController = {
  async getStudentById(req, res) {
    const { userId } = req.params;

    try {
      const studentDetails = await StudentModel.getStudentById(userId);
      // console.log("student:", studentDetails);

      res.status(200).json([studentDetails]);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.log(error);
    }
  },

  async getAccountInfo(req, res) {
    const { userId } = req.params;
    console.log("userId: ", userId);

    try {
      const accountDetails = await StudentModel.getAccountInfo(userId);

      // console.log("stu acc:", accountDetails);

      res.status(200).json([accountDetails]);
    } catch (error) {
      console.error("Error fetching account info", error);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  },
};

const StudentAttendanceController = {
  // get student attendance
  async getAttendance(req, res) {
    const { studentId } = req.params;

    try {
      const result = await StudentAttendanceModel.getAttendance(studentId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Cannot fetch your attendance record!" });
    }
  },
};

const StudentExamController = {
  async getAllExams(req, res) {
    const allExams = await studentExamModel.getAllExams();

    res.status(200).json(allExams);
  },

  async getExamsByClassId(req, res) {
    const { classId, studentId } = req.params;

    try {
      const allExams = await studentExamModel.getExamsByClassId(
        classId,
        studentId
      );

      res.status(200).json(allExams);
    } catch (error) {
      console.error("Error fetching student exams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async getExamDetailsByClassId(req, res) {
    const { examId, classId, studentId } = req.params;

    try {
      const allExams = await studentExamModel.getExamDetailsByClassId(
        examId,
        classId,
        studentId
      );

      res.status(200).json(allExams);
    } catch (error) {
      console.error("Error fetching student exams: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // TAKE EXAM: Retrieve all questions with options
  async takeStudentExam(req, res) {
    const { subjectId, examId } = req.params;

    try {
      const { questionsWithOptions, numQuestions } =
        await studentExamModel.takeStudentExam(subjectId, examId);

      res.status(200).json({ questionsWithOptions, numQuestions });
    } catch (error) {
      console.error("Error fetching questions: ", error);
      res.status(500).json({ error: error });
    }
  },

  // Submit grades for exam
  async submitExamResult(req, res) {
    const { examId, subjectId } = req.params;
    const { studentId, marksObtained, isComplete, classCode } = req.body;

    try {
      const submitGrade = await studentExamModel.submitExamResult(
        studentId,
        examId,
        subjectId,
        marksObtained,
        isComplete,
        classCode
      );

      res.status(200).json({ message: submitGrade });
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = {
  StudentController,
  StudentAttendanceController,
  StudentExamController,
};
