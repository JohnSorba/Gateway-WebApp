// DATABASE QUERIES
const loginQuery = "SELECT * FROM user_accounts WHERE username = $1";

const accountQuery =
  "INSERT INTO user_accounts (username, password, user_type, email, student_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";

const registerPupilQuery =
  "INSERT INTO pupil_information (student_id, first_name, last_name, gender, age, data_of_birth, phone_number, address, parent_name, parent_contact, profile_photo,  class_name, class_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *";

const admissionQuery =
  "INSERT INTO pupil_admission ( admission_id, student_id, admission_date, admission_status, class_code) VALUES ($1, $2, $3, $4, $5) RETURNING *";

const existingUserQuery =
  "SELECT * FROM user_accounts WHERE email = $1 OR username = $2";

module.exports = {
  loginQuery,
  accountQuery,
  registerPupilQuery,
  admissionQuery,
  existingUserQuery,
};
