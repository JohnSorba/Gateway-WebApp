const { AdminReportModel } = require("../models/reports");

const AdminReportController = {
  // Get By Exams
  async getAllExamResult(req, res) {
    // const {query} = req.params;
    try {
      const result = await AdminReportModel.getAllExamResult();

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  // Get all reports
  async getAllStudentResult(req, res) {
    const { examId } = req.params;

    try {
      const result = await AdminReportModel.getAllStudentResult(examId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  // Get all reports
  async getStudentResultById(req, res) {
    const { studentId, examId } = req.params;
    console.log("student ID: ", studentId);

    try {
      const result = await AdminReportModel.getStudentResultById(
        studentId,
        examId
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

  // Get by student ID
  async getByStudentId(req, res) {
    const { studentId } = req.params;
    try {
      const result = await AdminReportModel.getByStudentId(studentId);

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};

module.exports = {
  AdminReportController,
};
