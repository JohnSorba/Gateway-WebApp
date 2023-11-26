const { Router } = require("express");
// const { TimetableController } = require("../controllers/timetable");
const {
  ClassController,
  SubjectController,
  ShuffleController,
} = require("../controllers/timetable");

const router = Router();

// console.log(ClassController.getClassTimetable);

// router.post("/createTimetable", TimetableController);

// get timetable
router.get("/:classCode", ClassController.getClassTimetable);

// shuffle timetable
router.get("shuffleTimetable/:classCode", ShuffleController);

// add subject
router.post("/addSubject", SubjectController.addSubject);

// update subject
router.put("/subjects/:subjectId", SubjectController.updateSubject);

// delete subject
router.delete("/subjects/:subjectId", SubjectController.deleteSubject);

module.exports = router;
