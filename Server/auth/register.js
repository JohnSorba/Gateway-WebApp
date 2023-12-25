require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("../db");
const queries = require("../queries");

// REGISTER USER ACCOUNT CONTROLLER
const register = async (req, res) => {
  // extract/destructure object from the request body
  const {
    // username,
    // password,
    // roleId,
    // email,
    // // studentId, (generated on the server-side)
    // // personal information
    // firstName,
    // lastName,
    // gender,
    // age,
    // dateOfBirth,
    // phoneNumber,
    // address,
    // className,
    // profilePhoto,
    // // Student Info
    // parentName,
    // parentContact,
    // // Admission information
    // // admissionId, (generated on the server-side)
    // admissionDate,
    // admissionStatus,
    // classCode,
    // // Teacher Info
    // // teacherId, (generated on the server-side)
    // qualifications,
    // dateJoined,
    // employmentStatus,
    // additionalNotes,

    roleId,
    ...formData
  } = req.body;

  // Add regex patterns here for validation as constants
  const usernamePattern = /^[a-zA-Z0-9_]{3,10}$/;
  const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const validateRegistration = () => {
    const errors = [];

    // Username validation
    if (!formData.username) {
      errors.push("Username is required");
    } else if (!usernamePattern.test(formData.username)) {
      errors.push(
        "Username must be 3-10 characters long and can only contain alphanumeric characters and underscores."
      );
    }

    // Email validation
    if (!formData.email) {
      errors.push("Email is required");
    } else if (!emailPattern.test(formData.email)) {
      errors.push("Please enter a valid email address.");
    }

    // Password validation
    if (!formData.password) {
      errors.push("Password is required.");
    } else if (!passwordPattern.test(formData.password)) {
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
      formData.email,
      formData.username,
    ]);

    if (existingUserResult.rows.length > 0) {
      // Check which constraint was violated (email or username)
      const existingUser = existingUserResult.rows[0];
      if (
        existingUser.email === formData.email &&
        existingUser.username === formData.username
      ) {
        return res
          .status(409)
          .send({ error: "Email and Username are already in use" });
      } else if (existingUser.email === formData.email) {
        return res.status(409).send({ error: "Email already in use." });
      } else if (existingUser.username === formData.username) {
        return res.status(409).send({ error: "Username already in use." });
      }
    }

    ////////////////////////////////////////////////
    const { rows } = await client.query("SELECT * FROM id_storage");
    const teacherID = rows[0].id_value;
    const studentID = rows[1].id_value;
    const admissionID = rows[2].id_value;

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

    ////////////////////////////////////////////////
    // Hash password
    const hashedPassword = await bcrypt.hash(
      formData.password,
      parseInt(process.env.SALT_ROUNDS)
    );

    // Insert Registerd User Account Details in Database
    const userResult = await client.query(queries.accountQuery, [
      formData.username,
      hashedPassword,
      formData.email,
      roleId,
    ]);

    // Assign row data to registered user
    const userId = userResult.rows[0].user_id;

    // role id (3) === 'student'
    // role id (2) === 'teacher'

    const registerStudent = async (studentData, userId) => {
      const { updatedAidValue, updatedSidValue, newStudentID, newAdmissionID } =
        generateID(studentID, admissionID, teacherID);

      // Increment and update the student ID in the database
      await client.query(
        "UPDATE id_storage SET id_value = $1 WHERE id_name = $2",
        [updatedSidValue, "student_id"]
      );
      // Increment and update the admission ID in the database
      await client.query(
        "UPDATE id_storage SET id_value = $1 WHERE id_name = $2",
        [updatedAidValue, "admission_id"]
      );

      // insert personal details
      await client.query(queries.registerPupilQuery, [
        newStudentID,
        userId,
        studentData.firstName,
        studentData.lastName,
        studentData.gender,
        studentData.age,
        studentData.dateOfBirth,
        studentData.phoneNumber,
        studentData.address,
        studentData.parentName,
        studentData.parentContact,
        studentData.profilePhoto,
      ]);

      // insert admission details
      await client.query(queries.admissionQuery, [
        newAdmissionID,
        newStudentID,
        studentData.admissionDate,
        studentData.admissionStatus,
        studentData.classCode,
      ]);

      return { newStudentID, newAdmissionID };
    };

    const registerTeacher = async (teacherData, userId) => {
      const { newTeacherID, updatedTidValue } = generateID(
        studentID,
        admissionID,
        teacherID
      );
      // Increment and update the teacher ID in the database
      await client.query(
        "UPDATE id_storage SET id_value = $1 WHERE id_name = $2",
        [updatedTidValue, "teacher_id"]
      );
      // Insert Teacher details

      await client.query(queries.registerTeacherQuery, [
        newTeacherID,
        userId,
        teacherData.firstName,
        teacherData.lastName,
        teacherData.dateOfBirth,
        teacherData.gender,
        teacherData.phoneNumber,
        teacherData.address,
      ]);

      await client.query(queries.employmentDetailsQuery, [
        newTeacherID,
        teacherData.qualifications,
        teacherData.dateJoined,
        teacherData.profilePhoto,
        teacherData.additionalNotes,
        teacherData.employmentStatus,
      ]);

      await client.query(
        "INSERT INTO teacher_classes (teacher_id, class_code) VALUES ($1, $2)",
        [newTeacherID, teacherData.classCode]
      );
    };

    const registerAdmin = async (adminData, userId) => {
      await client.query(queries.registerAdminQuery, [
        userId,
        adminData.firstName,
        adminData.lastName,
        adminData.gender,
        adminData.age,
        adminData.dateOfBirth,
        adminData.phoneNumber,
        adminData.address,
        adminData.profilePhoto,
      ]);
    };

    let result;
    // conditional insertion into students or teachers table
    if (roleId === 3) {
      result = await registerStudent(formData, userId);
    } else if (roleId === 2) {
      result = await registerTeacher(formData, userId);
    } else if (roleId === 1) {
      result = await registerAdmin(formData, userId);
    }

    // Commit the transaction
    await client.query("COMMIT");

    res.status(201).json({ message: "Registration Successful", user: result });
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
