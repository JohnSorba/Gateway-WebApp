const { Router } = require("express");
const router = Router();

const {
  StudentController,
  StudentAttendanceController,
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

module.exports = router;
