const { Router } = require("express");
const router = Router();

const { StudentController } = require("../controllers/student");
const { authenticateToken } = require("../middleware/authenticate");

// retrieve personal details
router.get("/details/personal/:userId", StudentController.getStudentById);

// retrieve account details
router.get("/details/account/:userId", StudentController.getAccountInfo);

// Example route using the middleware
router.get("/user/details", authenticateToken, (req, res) => {
  // Access the user details from the request object
  const user = req.user;

  res.json({ user });
});

module.exports = router;
