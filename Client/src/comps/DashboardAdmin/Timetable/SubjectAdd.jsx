import axios from "axios";
import { useState } from "react";

/* eslint-disable react/prop-types */
function SubjectAdd({
  subjectFormData,
  onSubjectChange,
  onSubjectAdd,
  classes,
  onModalClose,
}) {
  const [message, setMessage] = useState("");
  // Submit Added subject
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3000/timetable/addSubject`,
        subjectFormData
      );

      const message = response.data.message;

      if (message) {
        setMessage(message);
        onSubjectAdd();
      } else {
        setMessage("Failed to add subject! Please try again");
      }

      console.log(message);
    } catch (error) {
      console.error("Error adding subject", error);
      setMessage(error.response.data.error);
    }
  };
  return (
    <div className="modal">
      <header className="mb-6">
        <h3 className="text-lg mt-8 mb-4">Add Subject</h3>
        <p>
          Please follow the following format:
          <br />
          Subject Code: G-CLASSCODE <br />
        </p>
      </header>

      <form>
        <article className="form-group">
          <label htmlFor="classAssigned" className="form-label">
            Class Assigned
          </label>
          <select
            id="classAssigned"
            name="classAssigned"
            value={subjectFormData.classCode}
            className="form-select"
            onChange={onSubjectChange}
          >
            <option value="Select Class" disabled>
              Select Class
            </option>
            {classes?.map((cls) => (
              <option key={cls.class_code} value={cls.class_code}>
                {cls.class_code}
              </option>
            ))}
          </select>
        </article>
        <article className="form-group">
          <label htmlFor="subjectName" className="form-label">
            Subject Name
          </label>
          <input
            type="text"
            id="subjectName"
            name="subjectName"
            value={subjectFormData.subjectName}
            className="form-input"
            onChange={onSubjectChange}
          />
        </article>
        <article className="form-group">
          <label htmlFor="subjectCode" className="form-label">
            Subject Code
          </label>
          <input
            type="text"
            id="subjectCode"
            name="subjectCode"
            value={subjectFormData.subjectCode}
            className="form-input"
            onChange={onSubjectChange}
          />
        </article>
        <div className="flex gap-8">
          <button
            type="button"
            className="form-button grow"
            onClick={onModalClose}
          >
            Close
          </button>
          <button
            type="submit"
            className="form-button grow"
            onClick={handleSubjectSubmit}
          >
            Add
          </button>
        </div>

        {message}
      </form>
    </div>
  );
}

export default SubjectAdd;
