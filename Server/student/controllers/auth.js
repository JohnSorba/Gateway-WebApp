require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../db");
const queries = require("../queries");

// REGISTER USER ACCOUNT CONTROLLER
const registerUserAccount = async (req, res) => {
  // extract/destructure object from the request body
  const {
    username,
    password,
    user_type,
    email,
    // studentId, (generated on the server-side)

    // personal information
    firstName,
    lastName,
    gender,
    age,
    dateOfBirth,
    phoneNumber,
    address,
    parentName,
    parentContact,
    profilePhoto,
    className,

    // Admission information
    // admissionId, (generated on the server-side)
    admissionDate,
    admissionStatus,
    classCode,
  } = req.body;

  // Add regex patterns here for validation as constants
  const usernamePattern = /^[a-zA-Z0-9_]{3,10}$/;
  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const validateRegistration = () => {
    const errors = [];

    // Username validation
    if (!username) {
      errors.push("Username is required");
    } else if (!usernamePattern.test(username)) {
      errors.push(
        "Username must be 3-10 characters long and can only contain alphanumeric characters and underscores."
      );
    }

    // Email validation
    if (!email) {
      errors.push("Email is required");
    } else if (!emailPattern.test(email)) {
      errors.push("Please enter a valid email address.");
    }

    // Password validation
    if (!password) {
      errors.push("Password is required.");
    } else if (!passwordPattern.test(password)) {
      errors.push(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
      );
    }

    return errors; // Return array of error messages (if any)
  };

  // Call validateRegistration and get the array of errors
  const errors = validateRegistration();

  // If there are any errors, send a response back with the errors and do not proceed
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Begin a transaction to ensure that user_id is not incremented on failed attempts
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check for existing user email and username before attempting to insert

    const existingUserResult = await client.query(queries.existingUserQuery, [
      email,
      username,
    ]);

    if (existingUserResult.rows.length > 0) {
      // Check which constraint was violated (email or username)
      const existingUser = existingUserResult.rows[0];
      if (existingUser.email === email && existingUser.username === username) {
        return res
          .status(409)
          .send({ error: "Email and Username are already in use" });
      } else if (existingUser.email === email) {
        return res.status(409).send({ error: "Email already in use." });
      } else if (existingUser.username === username) {
        return res.status(409).send({ error: "Username already in use." });
      }
    }

    ////////////////////////////////////////////////
    const { rows } = await pool.query("SELECT * FROM id_storage");
    const studentID = rows[0].id_value;
    const admissionID = rows[1].id_value;

    // Generate New StudentID
    const generateID = (studentID, admissionID) => {
      // student ID format: '110060XXXX'

      // Increment the value returned from the server
      const updatedSidValue = studentID + 1;
      const newStudentID = `110060${updatedSidValue
        .toString()
        .padStart(4, "0")}`;

      // Increment the current admission ID
      const updatedAidValue = admissionID + 1;

      // get current year from date
      const date = new Date();
      const year = date.getFullYear().toString(); // convert to string

      // Admission ID format: '2023-XXXX'
      const newAdmissionID = `${year}-${updatedAidValue
        .toString()
        .padStart(3, "0")}`;

      return { updatedSidValue, updatedAidValue, newStudentID, newAdmissionID };
    };

    // destructure return values from generateID function
    const { updatedSidValue, updatedAidValue, newStudentID, newAdmissionID } =
      generateID(studentID, admissionID);

    // Increment and update the student ID in the database
    await pool.query("UPDATE id_storage SET id_value = $1 WHERE id_name = $2", [
      updatedSidValue,
      "student_id",
    ]);
    // Increment and update the admission ID in the database
    await pool.query("UPDATE id_storage SET id_value = $1 WHERE id_name = $2", [
      updatedAidValue,
      "admission_id",
    ]);

    ////////////////////////////////////////////////
    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );
    // insert personal details
    await client.query(queries.registerPupilQuery, [
      newStudentID,
      firstName,
      lastName,
      gender,
      age,
      dateOfBirth,
      phoneNumber,
      address,
      parentName,
      parentContact,
      profilePhoto,
      className,
      classCode,
    ]);

    // insert admission details
    await client.query(queries.admissionQuery, [
      newAdmissionID,
      newStudentID,
      admissionDate,
      admissionStatus,
      classCode,
    ]);

    // Insert Registerd User Account Details in Database
    const result = await client.query(queries.accountQuery, [
      username,
      hashedPassword,
      user_type,
      email,
      newStudentID,
    ]);

    // Commit the transaction
    await client.query("COMMIT");

    // Assign row data to registered user
    const user_id = result.rows[0].user_id;

    res
      .status(201)
      .json({ user: result.rows[0], newStudentID, newAdmissionID });
  } catch (error) {
    // Roll back the transaction in the case of error
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ error: "Registration Failed" });
  } finally {
    // Release the client back to the pool
    client.release();
  }
};

// LOGIN CONTROLLER
const loginUser = async (req, res) => {
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
      const expiresIn = "0.05h";
      return jwt.sign(
        { id: user.user_id, username: user.username, role: user.user_type },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn,
        }
      );
    };

    if (matchDetails) {
      // If successful, create JWT token
      const token = generateAuthToken();
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

// Middleware to authenticate and set user from token
function authenticateToken(req, res, next) {
  const authHeader = req.Headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if ((token = null)) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}



// ADMISSION CLASS FETCH CONTROLLER
const admissionClass = async (req, res) => {
  try {
    // Execute a raw SQL query to fetch classes from the database
    const query = "SELECT * FROM classes"; // Replace 'classes' with your actual table name
    const result = await pool.query(query);

    // Check if there are rows in the result
    if (result.rows.length === 0) {
      res.status(404).json({ error: "No classes found" });
    } else {
      res.json(result.rows);
    }
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ error: "Error fetching classes" });
  }
};

module.exports = {
  registerUserAccount,
  loginUser,
  admissionClass,
  authenticateToken,
};
