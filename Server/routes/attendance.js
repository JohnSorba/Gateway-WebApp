const { Router } = require("express");
const router = Router();

const {} = require("../controllers/teachers");
const {
  AttendanceController,
  AttendanceChartController,
} = require("../controllers/attendance");

////////////////////
// ATTENDANCE ROUTES
// get all attendance by date
router.get("/date-attendance", AttendanceController.getAllAttendanceByDate);

// get all attendance by students
router.get(
  "/students-attendance",
  AttendanceController.getAllAttendanceByStudents
);

// get all attendance by classes
router.get(
  "/classes-attendance",
  AttendanceController.getAllAttendanceByClasses
);

// get all attendance for classes by date
router.get(
  "/classes-date-attendance",
  AttendanceController.getAllClassesAttendanceByDate
);

// get all students attendance by class and date
router.get(
  "/date/class/students-attendance/:classId",
  AttendanceController.getStudentAttendanceByClassAndDate
);

// get details for specific class
router.get(
  "/class/details/:classId",
  AttendanceController.getClassAttendanceDetails
);

// get details for specific student
router.get(
  "/details/:studentId",
  AttendanceController.getStudentAttendanceDetails
);

//////////////////
// ATTENDANCE CHART DATA

//get chart data
router.get("/get-chart", AttendanceChartController.getAttendanceChartData);

module.exports = router;
