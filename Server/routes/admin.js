const { Router } = require("express");
const { UserAccountsController } = require("../controllers/admin");
const { authenticateToken } = require("../middleware/authenticate");

const router = Router();

// Example route using the middleware
router.get("/user/details", authenticateToken, (req, res) => {
  // Access the user details from the request object
  const user = req.user;

  res.json({ user });
});

// Get All Users
router.get("/get-all-users", UserAccountsController.getAllUsers);

// Delete User
router.delete("/delete/:userId", UserAccountsController.deleteUser);

module.exports = router;
