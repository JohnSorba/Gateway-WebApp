// DATABASE QUERIES
const loginQuery = `SELECT user_accounts.user_id,user_accounts.username, user_accounts.password,  user_accounts.role_id, roles.role_name
FROM user_accounts
INNER JOIN roles ON user_accounts.role_id = roles.role_Id
WHERE username = $1`;

const accountQuery =
  "INSERT INTO user_accounts (username, password,  email, role_id) VALUES ($1, $2, $3, $4) RETURNING *";

const registerPupilQuery =
  "INSERT INTO students (student_id, user_id, first_name, last_name, gender, age, date_of_birth, phone_number, address, parent_name, parent_contact, profile_photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *";

const admissionQuery =
  "INSERT INTO student_admission ( admission_id, student_id, admission_date, admission_status, class_code) VALUES ($1, $2, $3, $4, $5) RETURNING *";

const existingUserQuery =
  "SELECT * FROM user_accounts WHERE email = $1 OR username = $2";

const employmentDetailsQuery =
  "INSERT INTO teacher_employee_details (teacher_id, qualifications, joining_date, profile_photo, additional_notes, employee_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

const registerTeacherQuery =
  "INSERT INTO teachers (teacher_id, user_id, first_name, last_name, date_of_birth, gender, phone_number, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *";
const registerAdminQuery =
  "INSERT INTO admins (user_id, first_name, last_name, gender, age, date_of_birth,  phone_number, address, profile_photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";

module.exports = {
  loginQuery,
  accountQuery,
  registerPupilQuery,
  admissionQuery,
  existingUserQuery,
  registerTeacherQuery,
  registerAdminQuery,
  employmentDetailsQuery,
};
