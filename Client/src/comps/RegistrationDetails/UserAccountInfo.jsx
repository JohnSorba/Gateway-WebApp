/* eslint-disable react/prop-types */
import { useState } from "react";

function UserAccountInfo({
  formData,
  setFormData,
  formErrors,
  nextStep,
  animate,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("password");

  const toggleStatus = () => {
    if (showPassword) setStatus("password");
    if (!showPassword) setStatus("text");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    toggleStatus();
  };

  // Local handlers that call setFormData for updates
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to render error message for a field
  const renderErrorMessage = (fieldName) => {
    if (formErrors[fieldName]) {
      return (
        <div className={`errors  ${animate ? "animate" : ""}`}>
          {formErrors[fieldName]}
        </div>
      );
    }
    // If no error, return null to render nothing
    return null;
  };

  return (
    <div className="user-account self-center">
      <form noValidate>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className="form-input"
            value={formData.username}
            placeholder="username_1"
            onChange={handleChange}
            required
          />
          {/* Render error message for first name */}
          {renderErrorMessage("username")}
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-input"
            value={formData.email}
            placeholder="email123@example.com"
            onChange={handleChange}
            required
          />
          {/* Render error message for email */}
          {renderErrorMessage("email")}
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type={status}
            name="password"
            className="form-input"
            value={formData.password}
            placeholder="password"
            onChange={handleChange}
            required
          />
          {renderErrorMessage("password")}
          {/* Render error message for password */}
        </div>
        <div className="show-password">
          <label className="check-form-label" htmlFor="showPassword">
            Show Password
          </label>
          <input
            type="checkbox"
            id="showPassword"
            className="check-form-input"
            value={showPassword}
            onChange={toggleShowPassword}
          />
        </div>

        <button className="form-button" type="button" onClick={nextStep}>
          Next
        </button>
      </form>
      {/* <p>{message}</p> */}
    </div>
  );
}

export default UserAccountInfo;
