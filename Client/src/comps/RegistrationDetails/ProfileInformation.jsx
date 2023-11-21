/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { calculateAge, classNameMap } from "./RegistrationData";
import StudentProfile from "./StudentProfile";
import TeacherProfile from "./TeacherProfile";

function ProfileInformation({
  formData,
  setFormData,
  formErrors,
  nextStep,
  prevStep,
}) {
  // const [message, setMessage] = useState("");
  const [classes, setClasses] = useState([]);

  console.log("form data: ", formData);

  // Local handlers that call setFormData for updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to render error message for a field
  const renderErrorMessage = (fieldName) => {
    if (formErrors[fieldName]) {
      return <div className="errors">{formErrors[fieldName]}</div>;
    }
    // If no error, return null to render nothing
    return null;
  };

  // Simple YYYY-MM-DD format check
  const dobPattern = /^\d{4}-\d{2}-\d{2}$/;
  const handleDateOfBirthChange = (e) => {
    const newDateOfBirth = e.target.value;

    if (dobPattern.test(newDateOfBirth)) {
      const calculatedAge = calculateAge(new Date(newDateOfBirth));

      setFormData((prevFormData) => ({
        ...prevFormData,
        dateOfBirth: newDateOfBirth,
        age: calculatedAge >= 0 ? calculatedAge : "", // Store only non-negative values
      }));
    } else {
      // Handle invalid date format case
      setFormData((prevFormData) => ({
        ...prevFormData,
        dateOfBirth: newDateOfBirth,
        age: null, // Reset age to null if the date format is invalid
      }));
    }
  };

  const handleClassCodeChange = (e) => {
    const classCode = e.target.value;
    setFormData({
      ...formData,
      classCode,
      className: classNameMap[classCode] || "",
    });
  };

  const handleUserTypeChange = (e) => {
    const user = e.target.value;
    setFormData({
      ...formData,
      roleId:
        user === "admin"
          ? 1
          : user === "teacher"
          ? 2
          : user === "student"
          ? 3
          : null,
    });
  };

  // Fetch classes from database
  useEffect(() => {
    // Code to run on component mount
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/auth/admission-classes"
        );
        const data = await response.data;
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes: ", error);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="self-center">
      <form className="personal-info" noValidate>
        <div className="flex gap-4">
          {/* First name */}
          <article className="form-group grow">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-input w-full"
              value={formData.firstName}
              placeholder="First Name"
              onChange={handleChange}
              required
            />
            {renderErrorMessage("firstName")}
            {/* Render error message for first name */}
          </article>

          {/* Last Name */}
          <article className="form-group grow">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-input w-full"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
            {renderErrorMessage("lastName")}
          </article>

          {/* Date of Birth */}
          <article className="form-group grow">
            <label htmlFor="dateOfBirth" className="form-label">
              Date of Birth:
            </label>
            <input
              type="text"
              id="dateOfBirth"
              name="dateOfBirth"
              className="form-input w-full"
              value={formData.dateOfBirth}
              onChange={handleDateOfBirthChange}
              placeholder="YYYY-MM-DD"
              required
            />
            {renderErrorMessage("dateOfBirth")}
          </article>
        </div>
        <div className="flex gap-4 justify-between">
          {/* Select User Role */}
          <article className="form-group grow">
            <label htmlFor="user" className="form-label">
              Select User Role:
            </label>
            <select
              id="user"
              name="user"
              onChange={handleUserTypeChange}
              className="form-select"
            >
              <option value="" disabled>
                Select User Type
              </option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </article>
          {/* Gender */}
          <article className="form-group grow">
            <label htmlFor="gender" className="form-label">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </article>
          {/* class */}
          <article className="form-group grow">
            <label htmlFor="className" className="form-label">
              Class / Grade:
            </label>
            <select
              id="className"
              name="className"
              className="form-select w-full"
              value={formData.className}
              onChange={handleClassCodeChange}
              required
            >
              <option value="" disabled>
                Select Class
              </option>
              {classes.map((grade) => (
                <option key={grade.class_code} value={grade.class_code}>
                  {grade.class_code}
                </option>
              ))}
            </select>
          </article>
        </div>{" "}
        {/* Phone Number */}
        <article className="form-group">
          <label className="form-label">Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            className="form-input w-full"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
          {renderErrorMessage("phoneNumber")}
        </article>
        {/* Address */}
        <article className="form-group">
          <label className="form-label">Address:</label>
          <input
            type="text"
            name="address"
            className="form-input"
            value={formData.address}
            onChange={handleChange}
            placeholder="Home Address"
            required
          />
          {renderErrorMessage("address")}
        </article>
        {/* conditionally render form user */}
        {formData.roleId === 2 && (
          <TeacherProfile
            formData={formData}
            handleChange={handleChange}
            renderErrorMessage={renderErrorMessage}
          />
        )}
        {formData.roleId === 3 && (
          <StudentProfile
            formData={formData}
            handleChange={handleChange}
            renderErrorMessage={renderErrorMessage}
          />
        )}
      </form>{" "}
      {/* Nav Buttons */}
      <div className="flex justify-between gap-4">
        <button className="form-button" type="button" onClick={prevStep}>
          Back
        </button>
        <button className="form-button" type="button" onClick={nextStep}>
          Next
        </button>
      </div>
      {/* <p>{message}</p> */}
    </div>
  );
}

export default ProfileInformation;
