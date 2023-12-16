const { TeacherModel } = require("../models/teachers");

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

module.exports = { TeacherController };
