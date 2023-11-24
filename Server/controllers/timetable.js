// The controller will handle the HTTP requests and utilize the models to interact with the database

// const TimetableModel = require("../models/timetable");
const { ClassModel } = require("../models/timetable");

// const TimetableController = {
//   async createTimetableEntry(req, res) {
//     try {
//       const { classId, subjectId, teacherId, periodId, day } = req.body;
//       await TimetableModel.addTimetableEntry(
//         classId,
//         subjectId,
//         teacherId,
//         periodId,
//         day
//       );

//       res.status(201).send("Timetable entry created successfully");
//     } catch (error) {
//       res.status(500).send("Error creating timetable entry");
//     }
//   },
// };

const ClassController = {
  async getClassTimetable(req, res) {
    const classCode = await req.params.classCode;

    try {
      const subjects = await ClassModel.getSubjectsPerClass(classCode);

      const timetable = generateTimetable(subjects);

      return res.status(200).json({ subjects, timetable });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error fetching subjects" });
    }
  },
};

const generateTimetable = (subjects) => {
  // Assuming 4 periods per day, Monday to Friday
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  let timetable = days.map((day) => ({ day, periods: [] }));

  // Simple logic to distribute subjects across days and periods
  let subjectIndex = 0;
  for (let day of timetable) {
    for (let i = 0; i < 4; i++) {
      day.periods.push(subjects[subjectIndex % subjects.length]);
      subjectIndex++;
    }
  }

  return timetable;
};

module.exports = {
  // TimetableController,
  ClassController,
};
