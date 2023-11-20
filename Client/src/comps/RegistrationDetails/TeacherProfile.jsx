/* eslint-disable react/prop-types */
function TeacherProfile({
  formData,
  classes,
  handleChange,
  renderErrorMessage,
  handleDateOfBirthChange,
  handleClassCodeChange,
}) {
  return (
    <div>
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
      </div>

      <div className="flex justify-between gap-4">
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
      </div>
      {/* Qualifications */}
      <article className="form-group">
        <label htmlFor="qualifications" className="form-label">
          Career Qualifications:
        </label>
        <input
          type="text"
          id="qualifications"
          name="qualifications"
          className="form-input"
          value={formData.qualifications}
          onChange={handleChange}
          placeholder="Career Qualifications"
          required
        />
        {renderErrorMessage("address")}
      </article>
    </div>
  );
}

export default TeacherProfile;
