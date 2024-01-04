require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const queries = require("../queries");

// LOGIN CONTROLLER
const login = async (req, res) => {
  const { username, password } = req.body;

  // Login validation
  // Check for form inputs
  const validateLogin = (username, password) => {
    const errors = [];

    if (!username && !password) {
      errors.push("Username and Password is required.");
    } else if (!username) {
      errors.push("Username is required.");
    } else if (!password) {
      errors.push("Password is required");
    }

    return errors;
  };

  const errors = validateLogin(username, password);

  // If there are validation errors, return them and stop the process
  if (errors.length > 0) {
    return res.status(400).json({ error: errors });
  }

  try {
    const result = await pool.query(queries.loginQuery, [username]);

    // Check if user exists
    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Authentication Failed! User Not Found" });
    }

    // Verify password
    const hashedPassword = result.rows[0].password;
    const matchDetails = await bcrypt.compare(password, hashedPassword);

    const user = result.rows[0];

    // Utility function to generate JWT
    const generateAuthToken = () => {
      const expiresIn = "1h";
      return jwt.sign(
        {
          userId: user.user_id,
          username: user.username,
          role: user.role_name,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn,
        }
      );
    };

    if (matchDetails) {
      // If successful, create JWT token
      const token = generateAuthToken();

      // response returned to the client
      return res.status(200).json({
        message: "Login successful!",
        token,
      });
    } else {
      return res.status(401).json({
        error: "Invalid credentials: Incorrect Password!",
      });
    }

    // Error Block
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Login Failed" });
  }
};

module.exports = {
  login,
};
