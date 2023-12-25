const { UserAccountsModel } = require("../models/admin");

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

module.exports = { UserAccountsController };
