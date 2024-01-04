const { Router } = require("express");
const { AdminReportController } = require("../controllers/reports");

const router = Router();

//////////////////////////////////////////////////////
////////////////////////
// EXAM RESULTS //
////////////////////////

// Get Result for admin
router.get("/exam-result", AdminReportController.getAllExamResult);

// Get all Result for admin
router.get("/get-result/:examId", AdminReportController.getAllStudentResult);

// Get student Result for admin
router.get(
  "/student-result/:examId/:studentId",
  AdminReportController.getStudentResultById
);

// Get result for individual student (student dashboard)
router.get("/result/:studentId", AdminReportController.getByStudentId);

module.exports = router;
