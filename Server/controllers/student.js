const { StudentModel, StudentAttendanceModel } = require("../models/student");

const StudentController = {
  async getStudentById(req, res) {
    const { userId } = req.params;

    try {
      const studentDetails = await StudentModel.getStudentById(userId);
      // console.log("student:", studentDetails);

      res.status(200).json([studentDetails]);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      console.log(error);
    }
  },

  async getAccountInfo(req, res) {
    const { userId } = req.params;
    console.log("userId: ", userId);

    try {
      const accountDetails = await StudentModel.getAccountInfo(userId);

      // console.log("stu acc:", accountDetails);

      res.status(200).json([accountDetails]);
    } catch (error) {
      console.error("Error fetching account info", error);
      res.status(500).json({ error: "Internal Server Error!" });
    }
  },
};

const StudentAttendanceController = {
  // get student attendance
  async getAttendance(req, res) {
    const { studentId } = req.params;

    try {
      const result = await StudentAttendanceModel.getAttendance(studentId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Cannot fetch your attendance record!" });
    }
  },
};

module.exports = { StudentController, StudentAttendanceController };
