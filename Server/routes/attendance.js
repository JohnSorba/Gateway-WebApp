const AttendanceController = {
  async getAttendance(req, res) {
    try {
      const response = await AttendanceController.getAttendance();

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
    console.log("attendance controller");
  },
};

module.exports = { AttendanceController };
