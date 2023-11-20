const { Router } = require("express");

const { login } = require("../auth/login");
const { register } = require("../auth/register");

const { admissionClass } = require("../auth/classes");

// const { authenticateRole } = require("../middleware/authenticate");

const router = Router();

// Registration Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// Get Classes For Registration
router.get("/admission-classes", admissionClass);

module.exports = router;
