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

    try {
      const addAttendance = await TeacherAttendanceModel.addAttendanceStatus(
        attendanceDetails
      );

      res.status(201).json(addAttendance);
    } catch (error) {
      res.status(500).json({ error: "Cannot add attendance record!" });
      console.error(error);
    }
  },

  // view attendance records by date
  async getAttendanceByDate(req, res) {
    const { classId } = req.params;

    try {
      const attendanceRecord = await TeacherAttendanceModel.getAttendanceByDate(
        classId
      );

      res.status(200).json(attendanceRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Cannot fetch attendance by date" });
    }
  },

  // view attendance records by students
  async getAttendanceByStudents(req, res) {
    const { classId } = req.params;

    try {
      const attendanceRecord =
        await TeacherAttendanceModel.getAttendanceByStudents(classId);

      res.status(200).json(attendanceRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Cannot fetch attendance for students" });
    }
  },

  // view attendance records details
  async viewDailyAttendanceRecords(req, res) {
    const { classId } = req.params;
    const date = req.query.date;

    try {
      const attendanceRecord =
        await TeacherAttendanceModel.viewAttendanceRecords(classId, date);

      res.status(200).json(attendanceRecord);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error!" });
    }
  },

  // view attendance records details
  async viewDailyStudentAttendance(req, res) {
    const { classId, studentId } = req.params;

    try {
      const attendanceRecord =
        await TeacherAttendanceModel.viewDailyStudentsAttendance(
          classId,
          studentId
        );

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
