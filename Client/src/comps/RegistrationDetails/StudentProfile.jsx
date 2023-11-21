/* eslint-disable react/prop-types */
function StudentProfile({ formData, handleChange, renderErrorMessage }) {
  return (
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
      <article className="form-group w-full">
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
  );
}

export default StudentProfile;
