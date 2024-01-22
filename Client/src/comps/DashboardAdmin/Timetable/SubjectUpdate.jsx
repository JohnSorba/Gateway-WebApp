/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

function SubjectUpdate({ subject, onSave, onCancel, onSetMessage, message }) {
  const [subjectName, setSubjectName] = useState("");

  useEffect(() => {
    setSubjectName(subject.subject_name);
  }, [subject.subject_name]);

  const handleUpdateSubmit = (e) => {
    e.preventDefault();

    onSave(subject.id, { subjectName });
  };

  const changeSubject = (e) => {
    setSubjectName(e.target.value);
    onSetMessage("");
  };

  return (
    <div className="modal">
      <h3 className="modal-header">
        Editing:{" "}
        <em>
          {subject.subject_name} ({subject.subject_code})
        </em>
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
            value={subject.subject_code}
            placeholder={subject.subject_code}
            className="form-input hover:cursor-not-allowed"
            disabled
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
            className="form-input "
            onChange={changeSubject}
          />
        </article>

        <div className="flex gap-8 ">
          <button
            className="form-button grow bg-red-500"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button className="form-button grow bg-green-500" type="submit">
            Save
          </button>
        </div>
        {message && <p className="text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
}

export default SubjectUpdate;
