const { Router } = require("express");
const router = Router();

const {
  TeacherController,
  TeacherAttendanceController,
} = require("../controllers/teachers");

// retrieve personal details
router.get("/details/personal/:userId", TeacherController.getTeacherById);

// retrieve account details
router.get("/details/account/:userId", TeacherController.getAccountInfo);

router.get("/timetable/:classId");

////////////////////////
// ATTENDANCE ROUTES
// get student by class
router.get(
  "/attendance/students/:classId",
  TeacherAttendanceController.getStudentsByClass
);

// add attendance
router.post("/add-attendance", TeacherAttendanceController.addAttendanceStatus);

// get all student attendance by class
router.get(
  "/get-attendance/:classId",
  TeacherAttendanceController.viewAttendanceRecords
);

// get attendance by student Id
router.get(
  "/get-attendance/:studentId",
  TeacherAttendanceController.viewStudentAttendance
);

module.exports = router;
