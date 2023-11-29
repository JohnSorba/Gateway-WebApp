/* eslint-disable react/prop-types */
import { useState } from "react";

function SubjectUpdate({ subject, onSave, onCancel }) {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    onSave(subject.id, { subjectCode, subjectName });
  };

  return (
    <div className="modal">
      <h3 className="modal-header">
        Editing: <em>{subject.subject_name}</em>
      </h3>
      <form onSubmit={handleUpdateSubmit}>
        <article className="form-group">
          <label htmlFor="subjectCode" className="form-label">
            Subject Code
          </label>
          <input
            type="text"
            name="subjectCode"
            id="subjectCode"
            value={subjectCode}
            placeholder="Subject Code"
            className="form-input"
            onChange={(e) => setSubjectCode(e.target.value)}
          />
        </article>
        <article className="form-group">
          <label htmlFor="subjectName" className="form-label">
            Subject Name
          </label>
          <input
            type="text"
            name="subjectName"
            id="subjectName"
            value={subjectName}
            placeholder="Subject Name"
            className="form-input"
            onChange={(e) => setSubjectName(e.target.value)}
          />
        </article>

        <div className="flex gap-8 ">
          <button className="form-button grow" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="form-button grow" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubjectUpdate;
