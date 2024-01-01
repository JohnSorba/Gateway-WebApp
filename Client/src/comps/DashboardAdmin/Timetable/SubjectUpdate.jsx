/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

function SubjectUpdate({ subject, onSave, onCancel, onSetMessage, message }) {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");

  useEffect(() => {
    setSubjectCode(subject.subject_code);
    setSubjectName(subject.subject_name);
  }, []);

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    onSave(subject.id, { subjectCode, subjectName });
  };

  const changeCode = (e) => {
    setSubjectCode(e.target.value);
    onSetMessage("");
  };

  const changeSubject = (e) => {
    setSubjectName(e.target.value);
    onSetMessage("");
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
            onChange={changeCode}
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
            onChange={changeSubject}
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
        {message && <p className="text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
}

export default SubjectUpdate;
