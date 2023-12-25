const randomNumber = () => {
  const getRand = Math.floor(Math.random() * 10000);
  return getRand;
};

const randomPhotoNumber = randomNumber();

export const initialFormData = {
  // Shared user information
  // (Accoutnt Info)
  username: "",
  password: "",
  email: "",
  roleId: null, // Role_id is to determine if the user is a student or teacher

  // Personal Info
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  phoneNumber: "",
  address: "",

  // Specific to students
  studentId: null,
  admissionId: null,
  admissionDate: new Date().toISOString().split("T")[0],
  admissionStatus: "Enrolled",
  className: "",
  classCode: "",
  parentName: "",
  parentContact: "",

  // Specific to teachers
  teacherId: null,
  qualifications: "",
  dateJoined: new Date().toISOString().split("T")[0],
  additionalNotes: "",
  employmentStatus: "Active",

  // Misc
  profilePhoto: `https://i.pravatar.cc/300?u=${randomPhotoNumber}36`, // Assuming this is common for both students and teachers
};

export function calculateAge(dob) {
  const currentDate = new Date();
  let age = currentDate.getFullYear() - dob.getFullYear();
  const monthDiff = currentDate.getMonth() - dob.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && currentDate.getDate() < dob.getDate())
  ) {
    age--; // Subtract a year if the current date is before the birth date
  }
  return age;
}

export const classNameMap = {
  101: "Grade 1",
  102: "Grade 2",
  103: "Grade 3",
  104: "Grade 4",
  105: "Grade 5",
  106: "Grade 6",
};
