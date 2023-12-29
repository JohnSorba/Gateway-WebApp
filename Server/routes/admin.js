const { Router } = require("express");
const {
  UserAccountsController,
  StudentDetailsController,
  TeacherDetailsController,
  AdminDashboardController,
} = require("../controllers/admin");
const { authenticateToken } = require("../middleware/authenticate");

const router = Router();

// Example route using the middleware
router.get("/user/details", authenticateToken, (req, res) => {
  // Access the user details from the request object
  const user = req.user;

  res.json({ user });
});

// Get All Users
router.get("/get-all-users", UserAccountsController.getAllUsers);

// Delete User
router.delete("/delete/:userId", UserAccountsController.deleteUser);

////////////////////
// STUDENT DETAILS
// get all students
router.get("/get-students", StudentDetailsController.getAllStudentInfo);

// get student info
router.get("/student/:studentId", StudentDetailsController.getStudentInfo);

// TEACHER DETAILS
// get all teachers
router.get("/get-teachers", TeacherDetailsController.getAllTeachersInfo);

// get teacher info
router.get("/teacher/:teacherId", TeacherDetailsController.getTeacherInfo);

/////////////////////
// DASHBOARD STATS

router.get("/dashboard-stats", AdminDashboardController.getStats);

module.exports = router;
