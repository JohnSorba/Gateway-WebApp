const { Router } = require("express");
const router = Router();

const {
  StudentController,
  StudentAttendanceController,
  StudentExamController,
} = require("../controllers/student");

// retrieve personal details
router.get("/details/personal/:userId", StudentController.getStudentById);

// retrieve account details
router.get("/details/account/:userId", StudentController.getAccountInfo);

// get student attendance
router.get(
  "/get-attendance/:studentId",
  StudentAttendanceController.getAttendance
);

/////////////////////////////////////////////////////
////////////////////////
// STUDENT EXAMS ROUTES
////////////////////////

// Fetch all exams for exam home
router.get("/student-exam", StudentExamController.getAllExams);

// Fetch all exams by class ID
router.get(
  "/all-student-exams/:classId/:studentId",
  StudentExamController.getExamsByClassId
);

// get details for specific exam for a student
router.get(
  "/exam-details/:examId/:classId/:studentId",
  StudentExamController.getExamDetailsByClassIdAndStudentId
);

// Take Exam
router.get(
  "/take-exam/:examId/:subjectId",
  StudentExamController.takeStudentExam
);

// Submit grades
router.post(
  "/submit-grades/:examId/:subjectId",
  StudentExamController.submitExamResult
);

module.exports = router;
