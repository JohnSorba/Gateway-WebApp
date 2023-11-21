/* eslint-disable react/prop-types */
function TeacherProfile({ formData, handleChange, renderErrorMessage }) {
  return (
    <article className="form-group">
      {/* Qualifications */}
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
      {renderErrorMessage("qualifications")}
    </article>
  );
}

export default TeacherProfile;
