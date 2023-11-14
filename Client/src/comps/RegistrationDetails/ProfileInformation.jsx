/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
// import axios

function ProfileInformation({
  formData,
  setFormData,
  formErrors,
  nextStep,
  prevStep,
}) {
  // const [message, setMessage] = useState("");
  const [classes, setClasses] = useState([]);

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

  function calculateAge(dob) {
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

  // Fetch classes from database
  useEffect(() => {
    // Code to run on component mount
    axios
      .get("http://localhost:3000/auth/admission-classes")
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
    return () => {
      // Code to run on component unmount
    };
  }, []);

  return (
    <div className="self-center">
      <form className="personal-info" noValidate>
        <div className="flex gap-4">
          {/* First name */}
          <article className="form-group">
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
          <article className="form-group">
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
          <article className="form-group">
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

        <div className="flex justify-between gap-2">
          {/* class */}
          <article className="form-group">
            <label htmlFor="className" className="form-label">
              Class / Grade:
            </label>
            <select
              id="className"
              name="className"
              className="form-select grow w-full"
              value={formData.className}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Class Level
              </option>
              {classes.map((grade) => (
                <option key={grade.class_code} value={grade.class_name}>
                  {grade.class_name}
                </option>
              ))}
            </select>
          </article>
          {/* Gender */}
          <article className="form-group">
            <label htmlFor="gender" className="form-label">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              className="form-select grow w-full"
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

          {/* Phone Number */}
          <article className="form-group">
            <label className="form-label">Phone Number</label>
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
        </div>

        {/* Address */}
        <article className="form-group">
          <label className="form-label">Address</label>
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

        <div className="flex justify-between gap-4">
          {/* parent Name */}
          <article className="form-group w-full">
            <label className="form-label">Parent Full Name</label>
            <input
              type="text"
              name="parentName"
              className="form-input"
              value={formData.parentName}
              onChange={handleChange}
              placeholder="Parent/Guardian Name"
              required
            />
            {renderErrorMessage("parentName")}
          </article>
          {/* parent contact */}
          <article className="form-group w-full mb-8">
            <label className="form-label">Parent No.</label>
            <input
              type="text"
              name="parentContact"
              className="form-input"
              value={formData.parentContact}
              onChange={handleChange}
              placeholder="Parent/Guardian Contact"
              required
            />
            {renderErrorMessage("parentContact")}
          </article>
        </div>
      </form>{" "}
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
