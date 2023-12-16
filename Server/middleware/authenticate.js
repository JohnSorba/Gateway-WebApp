require("dotenv").config();
const jwt = require("jsonwebtoken");
const pool = require("../db");

// Middleware to authenticate and set user from token

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // console.log("authHeader: ", authHeader);
  // console.log("token: ", token);

  if (token) {
    try {
      // Decode the JWT tot get user information
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Extract the user identifier from the decoded JWT
      const userId = decoded.userId;
      console.log("user Id (in authToken): ", userId);

      // Query the database to get user details
      const userQuery = "SELECT * FROM user_accounts WHERE user_id = $1";
      let userDetailsQuery = "";

      const userResult = await pool.query(userQuery, [userId]);
      const user = userResult.rows[0];

      // Check user role and query additional details based on role
      if (user.role_id === 3) {
        userDetailsQuery = `SELECT s.*, sa.* FROM 
        students s
        JOIN student_admission sa 
        ON sa.student_id = s.student_id
        WHERE s.user_id = $1`;
      } else if (user.role_id === 2) {
        userDetailsQuery = `
        SELECT t.*, td.*, class_code
        FROM teachers t
        JOIN teacher_employee_details td
        ON t.teacher_id = td.teacher_id
        JOIN teacher_classes tc
        ON t.teacher_id = tc.teacher_id
        WHERE user_id = $1`;
      } else if (user.role_id === 1) {
        userDetailsQuery = "SELECT * FROM admins WHERE user_id = $1";
      }

      if (userDetailsQuery) {
        const userDetailsResult = await pool.query(userDetailsQuery, [userId]);
        user.userDetails = userDetailsResult.rows[0];
      }

      // Attach the user details to the request object for later use
      req.user = user;

      // Continue to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Error decoding JWT: ", error);
      res.status(401).json({ error: "Unauthorized Access" });
    }
  } else {
    // No token provided
    res.status(401).json({ error: "Unauthorized! No Token Provided" });
  }

  // if (!token) return res.sendStatus(401);

  // jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
  //   if (err) return res.sendStatus(403);
  //   req.user = user;
  //   next();
  // });
}

module.exports = {
  authenticateToken,
};
