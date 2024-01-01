import axios from "axios";

/* eslint-disable react/prop-types */
function SubjectAdd({
  subjectFormData,
  onSubjectChange,
  onSubjectAdd,
  classes,
  onAddModalClose,
  onShowAlert,
  message,
  onSetMessage,
  onSetType,
}) {
  // Submit Added subject
  const handleSubjectSubmit = async (e) => {
    e.preventDefault();

    const subjectCodeFormat = /^G\d{1,2}-[A-Z]{3,}$/;
    const isSubjectCodeValid = subjectCodeFormat.test(
      subjectFormData.subjectCode
    );

    // Check if no input is empty
    if (Object.values(subjectFormData).some((value) => value.trim() === "")) {
      onSetMessage("Please fill in all fields!");
      return;
    }
    // CHECK IF THE SUBJECT CODE INPUT IS VALID
    if (!isSubjectCodeValid) {
      onSetMessage("Invalid Subject Code format. Use the format 'G1-MATH'.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/timetable/addSubject`,
        subjectFormData
      );

      const message = response.data.message;
      const type = response.data.type;

      onSetMessage(message);
      onSetType(type);
      onShowAlert(true);
      onAddModalClose();
      onSubjectAdd();
    } catch (error) {
      console.error("Error adding subject", error);
      onSetMessage(error.response.data.error);
    }
  };

  console.log("subject code: ", typeof subjectFormData.subjectCode);

  return (
    <div className="modal">
      <header className="mb-6">
        <h3 className="text-lg mt-8 mb-4">Add Subject</h3>
        <p>
          Subject Code Format:{" "}
          <span className="font-semibold">(e.g. G1-MATH )</span>
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
            <option value="">Select Class</option>
            {classes?.map((cls) => (
              <option key={cls.class_code} value={cls.class_code}>
                {cls.class_code}
              </option>
            ))}
          </select>
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
        <div className="flex gap-8">
          <button
            type="button"
            className="form-button grow"
            onClick={onAddModalClose}
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
        <p className="text-center text-red-500">{message}</p>
      </form>
    </div>
  );
}

export default SubjectAdd;
