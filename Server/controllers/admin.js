const {
  UserAccountsModel,
  StudentDetailsModel,
  TeacherDetailsModel,
  AdminDashboardModel,
} = require("../models/admin");

const UserAccountsController = {
  // Retrieve all
  async getAllUsers(req, res) {
    try {
      const result = await UserAccountsModel.getAllUsers();

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },

  // delete user
  async deleteUser(req, res) {
    const { userId } = req.params;

    try {
      const result = await UserAccountsModel.deleteUser(userId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

const StudentDetailsController = {
  // Get all student info
  async getAllStudentInfo(req, res) {
    try {
      const studentDetails = await StudentDetailsModel.getAllStudentInfo();

      res.status(200).json(studentDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },

  // get individual student info
  async getStudentInfo(req, res) {
    const { studentId } = req.params;

    try {
      const studentInfo = await StudentDetailsModel.getStudentInfo(studentId);

      res.status(200).json(studentInfo);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
};

const TeacherDetailsController = {
  // Get all student info
  async getAllTeachersInfo(req, res) {
    try {
      const teacherDetails = await TeacherDetailsModel.getAllTeacherInfo();

      res.status(200).json(teacherDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },

  // get individual teacher info
  async getTeacherInfo(req, res) {
    const { teacherId } = req.params;

    try {
      const teacherInfo = await TeacherDetailsModel.getTeacherInfo(teacherId);

      res.status(200).json(teacherInfo);
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error!",
        error: "Cannot retrieve teacher details.",
      });
    }
  },
};

const AdminDashboardController = {
  async getStats(req, res) {
    try {
      const stats = await AdminDashboardModel.getStats();

      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ error: "Cannot retrieve stats!" });
    }
  },
};

module.exports = {
  UserAccountsController,
  StudentDetailsController,
  TeacherDetailsController,
  AdminDashboardController,
};
