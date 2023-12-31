const {
  AttendanceModel,
  AttendanceChartModel,
} = require("../models/attendance");

const AttendanceController = {
  // view attendance records by date
  async getAllAttendanceByDate(req, res) {
    try {
      const attendanceRecord = await AttendanceModel.getAllAttendanceByDate();

      res.status(200).json(attendanceRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Cannot fetch all attendance by date" });
    }
  },

  // view attendance records by students
  async getAllAttendanceByStudents(req, res) {
    try {
      const attendanceRecord =
        await AttendanceModel.getAllAttendanceByStudents();

      res.status(200).json(attendanceRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Cannot fetch attendance for students" });
    }
  },

  // view attendance records by classes
  async getAllAttendanceByClasses(req, res) {
    try {
      const attendanceRecord =
        await AttendanceModel.getAllAttendanceByClasses();

      res.status(200).json(attendanceRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Cannot fetch attendance for classes" });
    }
  },

  // view attendance records by date for all classes
  async getAllClassesAttendanceByDate(req, res) {
    const { date } = req.query;

    try {
      const attendanceRecord =
        await AttendanceModel.getAllClassAttendanceByDate(date);

      res.status(200).json(attendanceRecord);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Cannot fetch classes attendance for students" });
    }
  },

  // view attendance records by date for all classes
  async getStudentAttendanceByClassAndDate(req, res) {
    const { classId } = req.params;
    const { date } = req.query;

    try {
      const attendanceRecord =
        await AttendanceModel.getStudentAttendanceByClassAndDate(classId, date);

      res.status(200).json(attendanceRecord);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Cannot fetch classes attendance for students" });
    }
  },

  // get class attendance details (counts)
  async getClassAttendanceDetails(req, res) {
    const { classId } = req.params;

    try {
      const students = await AttendanceModel.getClassAttendanceDetails(classId);

      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error!" });
    }
  },

  // get class attendance details (counts)
  async getStudentAttendanceDetails(req, res) {
    const { studentId } = req.params;

    try {
      const studentAttendance =
        await AttendanceModel.getStudentAttendanceDetails(studentId);

      res.status(200).json(studentAttendance);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error!" });
    }
  },
};

const AttendanceChartController = {
  // get class attendance details (counts)
  async getAttendanceChartData(req, res) {
    try {
      const chartData = await AttendanceChartModel.getAttendanceChartData();

      res.status(200).json(chartData);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error!" });
    }
  },
};

module.exports = { AttendanceController, AttendanceChartController };
