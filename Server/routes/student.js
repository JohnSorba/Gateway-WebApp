const { Router } = require("express");
const router = Router();

const { StudentController } = require("../controllers/student");

// retrieve personal details
router.get("/details/personal/:userId", StudentController.getStudentById);

// retrieve account details
router.get("/details/account/:userId", StudentController.getAccountInfo);

module.exports = router;
