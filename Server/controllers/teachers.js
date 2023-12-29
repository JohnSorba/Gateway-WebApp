const { TeacherModel, TeacherAttendanceModel } = require("../models/teachers");

const TeacherController = {
  async getTeacherById(req, res) {
    const { userId } = req.params;

    try {
      const teacherDetails = await TeacherModel.getTeacherById(userId);
      //   console.log("teacher:", teacherDetails);

      res.status(200).json([teacherDetails]);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.log(error);
    }
  },

  async getAccountInfo(req, res) {
    const { userId } = req.params;

    try {
      const accountDetails = await TeacherModel.getAccountInfo(userId);

      //   console.log("tch acc:", accountDetails);

      res.status(200).json([accountDetails]);
    } catch (error) {
      console.error("Error fetching account info", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

const TeacherAttendanceController = {
  // get students by class
  async getStudentsByClass(req, res) {
    const { classId } = req.params;

    try {
      const students = await TeacherAttendanceModel.getStudentsByClass(classId);

      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error!" });
    }
  },

  // add attendance
  async addAttendanceStatus(req, res) {
    const { attendanceDetails } = req.body;

    console.log(attendanceDetails);

    try {
      const addAttendance = await TeacherAttendanceModel.addAttendanceStatus(
        attendanceDetails
      );

      if (addAttendance) {
        res.status(201).json(addAttendance);
      } else {
        res.status(500).json({ addAttendance });
      }
    } catch (error) {
      res.status(500).json({ error: "Cannot add attendance record!" });
    }
  },

  // view attendance records
  async viewAttendanceRecords(req, res) {
    const { classId } = req.params;

    try {
      const attendanceRecord =
        await TeacherAttendanceModel.viewAttendanceRecords(classId);

      res.status(200).json(attendanceRecord);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error!" });
    }
  },

  // view attendance record by student Id
  async viewStudentAttendance(req, res) {
    const { studentId } = req.params;

    try {
      const studentAttendance =
        await TeacherAttendanceModel.viewStudentAttendance(studentId);

      console.log(studentAttendance);

      res.status(200).json(studentAttendance);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error!" });
    }
  },
};

module.exports = { TeacherController, TeacherAttendanceController };
