const { Router } = require("express");
const {
  registerUserAccount,
  loginUser,
  admissionClass,
  getId,
} = require("./controllers/auth");

const router = Router();

// Registration Route
router.post("/register", registerUserAccount);

// Get student ID route
router.get("/get-student-admission-id", getId);

// Login Route
router.post("/login", loginUser);

// Get Classes For Registration
router.get("/admission-classes", admissionClass);

module.exports = router;
