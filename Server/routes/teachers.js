const { Router } = require("express");
const router = Router();

const { TeacherController } = require("../controllers/teachers");

// retrieve personal details
router.get("/details/personal/:userId", TeacherController.getTeacherById);

// retrieve account details
router.get("/details/account/:userId", TeacherController.getAccountInfo);

router.get("/timetable/:classId");

module.exports = router;
