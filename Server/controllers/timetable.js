// The controller will handle the HTTP requests and utilize the models to interact with the database

// const TimetableModel = require("../models/timetable");
const { ClassModel, SubjectModel } = require("../models/timetable");

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
    const { classCode } = await req.params;

    try {
      const subjects = await ClassModel.getSubjectsPerClass(classCode);

      const timetable = generateTimetable(subjects);

      return res.status(200).json({ subjects, timetable });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error fetching timetable" });
    }
  },
};

const SubjectController = {
  async addSubject(req, res) {
    const { subjectName, subjectCode, classAssigned } = req.body;

    try {
      SubjectModel.addSubject(subjectName, subjectCode, classAssigned);

      res.status(200).send({ message: "Subject added successfully" });
    } catch (error) {
      res.status(500).send("Error adding subject", error);
    }
  },

  async updateSubject(req, res) {
    try {
      const subjectId = req.params.subjectId;
      const subjectDetails = req.body;

      console.log("body: ", subjectDetails);
      console.log("------------------------");
      console.log("id: ", subjectId);

      await SubjectModel.updateSubject(subjectId, subjectDetails);

      res.status(200).send({ message: "Subject updated successfully" });
    } catch (error) {
      console.error("Error updating subject: ", error);
      res.status(500).send("Error updating subject");
    }
  },

  async deleteSubject(req, res) {
    try {
      const subjectId = req.params.subjectId;
      console.log("subject Id: ", subjectId);
      console.log("------------------------");

      await SubjectModel.deleteSubject(subjectId);

      res.status(200).send("Subject deleted successfully");
    } catch (error) {
      console.error("Error deleting subject: ", error);
      res.send("Error deleting subjects");
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
    for (let i = 0; i < 5; i++) {
      if (i === 2) {
        day.periods.push({
          subject_name: "Break",
        });
        continue;
      } else {
        day.periods.push(subjects[subjectIndex % subjects.length]);
        subjectIndex++;
      }
    }
  }

  return timetable;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const ShuffleController = async (req, res) => {
  try {
    const classCode = req.params.classCode;
    console.log(classCode);

    const subjects = ClassModel.getSubjectsPerClass(classCode);

    const shuffledSubjects = shuffleArray(subjects);
    const newTimetable = generateTimetable(shuffledSubjects);

    res.status(200).json(newTimetable);
  } catch (error) {
    res.status(500).send("Error shuffling timetable");
  }
};

// function populateAndShuffleTimetable(subjects) {
//   var timetable = new Array(20).fill(null);

//   // Populate the timetable
//   subjects.forEach((subject) => {
//     var i;
//     do {
//       i = Math.floor(Math.random() * timetable.length);
//     } while (timetable[i] !== null);
//     timetable[i] = subject;
//   });

//   // Shuffle the timetable
//   for (var i = timetable.length - 1; i > 0; i--) {
//     var j = Math.floor(Math.random() * (i + 1));
//     var temp = timetable[i];
//     timetable[i] = timetable[j];
//     timetable[j] = temp;
//   }

//   return timetable;
// }

module.exports = {
  // TimetableController,
  ClassController,
  ShuffleController,
  SubjectController,
};
