const { Router } = require("express");
// const { TimetableController } = require("../controllers/timetable");
const { ClassController } = require("../controllers/timetable");

const router = Router();

// console.log(ClassController.getClassTimetable);

// router.post("/createTimetable", TimetableController);

router.get("/:classCode", ClassController.getClassTimetable);

module.exports = router;
