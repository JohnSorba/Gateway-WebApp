require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../db");
const queries = require("../queries");

// REGISTER USER ACCOUNT CONTROLLER
const register = async (req, res) => {
  // extract/destructure object from the request body
  const {
    username,
    password,
    roleId,
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
    className,
    profilePhoto,

    // Student Info
    parentName,
    parentContact,

    // Admission information
    // admissionId, (generated on the server-side)
    admissionDate,
    admissionStatus,
    classCode,

    // Teacher Info
    teacherId,
    qualifications,
    dateJoined,
    employmentStatus,
    additionalNotes,
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
    const teacherID = rows[2].id_value;

    console.log("teacher id: ", teacherID);

    // Generate New StudentID
    const generateID = (studentID, admissionID, teacherID) => {
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

      // teacher ID format: 'ST-1001'
      // Increment the value returned from the server
      const updatedTidValue = teacherID + 1;
      const newTeacherID = `ts-${updatedTidValue.toString().padStart(4, "0")}`;

      return {
        updatedSidValue,
        updatedAidValue,
        updatedTidValue,
        newStudentID,
        newAdmissionID,
        newTeacherID,
      };
    };

    // destructure return values from generateID function
    const {
      updatedSidValue,
      updatedAidValue,
      updatedTidValue,
      newStudentID,
      newAdmissionID,
      newTeacherID,
    } = generateID(studentID, admissionID);

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
    // Increment and update the teacher ID in the database
    await pool.query("UPDATE id_storage SET id_value = $1 WHERE id_name = $2", [
      updatedTidValue,
      "teacher_id",
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
      roleId,
      email,
      newStudentID,
    ]);

    const userID = 1;

    // Insert Teacher details
    const query =
      "INSERT INTO teachers (teacher_id, user_id, first_name, last_name, date_of_birth, gender, phone_number, address";
    await client.query(query, [
      newTeacherID,
      userID,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phoneNumber,
      address,
    ]);

    const employeeQuery =
      "INSERT INTO teacher_employee_details (teacher_id, qualifications, joining_date, profile_photo, additional_notes";
    await client.query(employeeQuery, [
      newTeacherID,
      qualifications,
      dateJoined,
      profilePhoto,
      additionalNotes,
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

module.exports = {
  register,
};
