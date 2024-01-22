const { Router } = require("express");
const router = Router();

const {
  TeacherController,
  TeacherAttendanceController,
  TeacherReportController,
  TeacherExamController,
} = require("../controllers/teachers");

// retrieve personal details
router.get("/details/personal/:userId", TeacherController.getTeacherById);

// retrieve account details
router.get("/details/account/:userId", TeacherController.getAccountInfo);

router.get("/timetable/:classId");

////////////////////////
// ATTENDANCE ROUTES
// get student by class for attendance update (done)
router.get(
  "/attendance/students/:classId",
  TeacherAttendanceController.getStudentsByClass
);

// add attendance (done)
router.post("/add-attendance", TeacherAttendanceController.addAttendanceStatus);

// get all student attendance by date for each class (done)
router.get(
  "/get-date-attendance/:classId",
  TeacherAttendanceController.getAttendanceByDate
);

// get all student attendance for students for each class
router.get(
  "/get-students-attendance/:classId",
  TeacherAttendanceController.getAttendanceByStudents
);

// get all student attendance by class for specific date (has query parameter [?='date']) (done)
router.get(
  "/get-attendance/:classId",
  TeacherAttendanceController.viewDailyAttendanceRecords
);

// get all student attendance by class for specific student
router.get(
  "/get-attendance/:classId/:studentId",
  TeacherAttendanceController.viewDailyStudentAttendance
);

// get attendance by student Id
router.get("/get-attendance/:studentId");

//////////////////////////////////////////
// Report Routes
router.get(
  "/report/getAll/:classId",
  TeacherReportController.getAllExamResultByClass
);

router.get(
  "/report/exam/details/:examId/:classId",
  TeacherReportController.getReportExamDetailsById
);

router.get(
  "/report/student-result/:examId/:classId/:studentId",
  TeacherReportController.getStudentResultById
);

////////////////////////////////////////////////////
router.get(
  "/exams/get-all-exams/:classId",
  TeacherExamController.getAllExamsByClass
);

// get ongoing exam details
router.get(
  "/ongoing/:examId/:classId",
  TeacherExamController.getOngoingExamDetails
);

// get mark exam complete
router.get(
  "/complete/:examId/:classId",
  TeacherExamController.markExamComplete
);

module.exports = router;
