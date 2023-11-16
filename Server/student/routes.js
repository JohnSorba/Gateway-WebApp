const { Router } = require("express");
const {
  registerUserAccount,
  loginUser,
  admissionClass,
  authenticateToken,
} = require("./controllers/auth");

const router = Router();

// Registration Route
router.post("/register", registerUserAccount);
// protected route example
router.get("/protected-route", authenticateToken, (req, res) => {
  // Access user from req.user
  res.send("This is a protected route");
});

// Login Route
router.post("/login", loginUser);

// Get Classes For Registration
router.get("/admission-classes", admissionClass);

module.exports = router;
