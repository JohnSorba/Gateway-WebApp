export const initialFormData = {
  // Account information
  username: "",
  password: "",
  user_type: "Student",
  email: "",
  studentId: null,

  // personal information
  firstName: "",
  lastName: "",
  gender: "",
  age: null,
  dateOfBirth: "",
  phoneNumber: "",
  address: "",
  parentName: "",
  parentContact: "",
  profilePhoto: "/path/to/img2.jpg",
  className: "",

  // Admission information
  admissionId: null,
  admissionDate: new Date().toISOString().split("T")[0],
  admissionStatus: "Enrolled",
  classCode: "101",
};
