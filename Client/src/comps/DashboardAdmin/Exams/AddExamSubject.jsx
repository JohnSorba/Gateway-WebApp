import axios from "axios";
import { useEffect, useState } from "react";

const addSubjectForm = {
  subjectCode: "",
  date: "",
  startTime: "",
  duration: 30,
  totalQuestions: null,
  examType: "Online",
  teacherId: "",
};

/* eslint-disable react/prop-types */
function AddExamSubject({ examId, onModalClose, fetchExam }) {
  const [subjects, setSubjects] = useState([]);
  //   const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [newSubject, setNewSubject] = useState(addSubjectForm);

  //   console.log(selectedSubjects);

  // Fetch subjects from the server
  //   useEffect(() => {
  //     fetchSubjects();
  //   }, []);

  //   const fetchSubjects = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3000/exams/get-subjects`
  //       );

  //       const data = response.data;

  //       setSubjects(data);
  //     } catch (error) {
  //       console.error("Error fetching subjects", error);
  //     }
  //   };

  // fetch classes
  useEffect(() => {
    // Code to run on component mount
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/auth/admission-classes"
        );
        const data = await response.data;
        // console.log(data);

        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes: ", error);
      }
    };

    fetchClasses();
  }, []);

  // fetch subjects by class
  useEffect(() => {
    if (selectedClass.length > 0) {
      getSubjectsByClass(selectedClass);
    }
  }, [selectedClass]);

  const getSubjectsByClass = async (selectedClass) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/timetable/${selectedClass}`
      );

      const subjectData = await res.data.subjects;
      // console.log("timetable: ", TimetableData);

      setSubjects(subjectData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  //   const handleCheckboxChange = (e) => {
  //     const { value } = e.target;
  //     setSelectedSubjects((prevSubjects) => {
  //       if (prevSubjects.includes(value)) {
  //         // if the subject is already selected, unselect it
  //         return prevSubjects.filter((subjectId) => subjectId !== value);
  //       } else {
  //         // If the subject is not selected, select it
  //         return [...prevSubjects, value];
  //       }
  //     });
  //   };

  const handleAddSubjectChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  //   Add Subject to Exam
  const handleAddSubject = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/exams/${examId}/subject`,
        { newSubject }
      );

      console.log(response.data);

      const res = response.data.title;
      const status = response.statusText;
      console.log(res + " " + status);

      //   const message = res + " " + status;
      console.log(res, status);
      //   setMessage(message);
      setNewSubject("");
      fetchExam(examId);
    } catch (error) {
      console.error("Error creating exams: ", error);
    }
  };

  // handle form submit events
  //   const handleAddSubject = (e) => {
  //     e.preventDefault();

  //     // Add each selected subject to the exam
  //     selectedSubjects.forEach((subjectId) => {
  //       try {
  //         const response = axios.post(
  //           `http://localhost:3000/exams/${examId}/exam-subjects`,
  //           {
  //             subjectId,
  //           }
  //         );

  //         const data = response.data.message;
  //         console.log(data);
  //       } catch (error) {
  //         console.error("Error adding subject details", error);
  //       }
  //     });
  //   };

  return (
    <div className="modals">
      <div>
        <div className="modal-backdrop"></div>
        <div className="modal">
          <h3 className="text-lg font-semibold mb-4">Enter Subject Details</h3>
          {/* Select Classes from a dropdown list */}
          <article>
            <label className="form-label">Class Name</label>
            <select
              value={selectedClass}
              onChange={handleClassChange}
              className="form-select mt-1 mb-4"
            >
              <option value="" disabled>
                Select Class
              </option>
              {classes?.map((cls) => (
                <option key={cls.class_code} value={cls.class_code}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </article>

          {/* Select subjects from dropdown */}
          <article className="form-group">
            <label className="form-label">Subject Name</label>
            <select
              name="subjectCode"
              value={newSubject.subjectCode}
              className="form-select"
              onChange={handleAddSubjectChange}
            >
              <option value="" disabled>
                Select Subject
              </option>
              {subjects.map((subject) => (
                <option key={subject.subject_code} value={subject.subject_code}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </article>
          <div className="flex gap-4">
            {/* Start Time Input */}
            <article className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={newSubject.startTime}
                className="form-input"
                onChange={handleAddSubjectChange}
              />
            </article>

            {/* Date Input */}
            <article className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={newSubject.date}
                className="form-input"
                onChange={handleAddSubjectChange}
              />
            </article>
          </div>

          <div className="flex gap-4">
            {/* Total Questions */}
            <article className="form-group">
              <label className="form-label">Total Questions</label>
              <input
                type="number"
                min="3"
                max="10"
                name="totalQuestions"
                value={newSubject.totalQuestions}
                className="form-input"
                onChange={handleAddSubjectChange}
              />
            </article>

            {/* Duration */}
            <article className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="number"
                min="30"
                max="60"
                name="duration"
                value={newSubject.duration}
                className="form-input"
                onChange={handleAddSubjectChange}
              />
            </article>
          </div>

          {/* Exam Type */}
          <article className="form-group">
            <label className="form-label">Exam Type</label>
            <select
              name="examType"
              value={newSubject.examType}
              className="form-select"
              onChange={handleAddSubjectChange}
            >
              <option value="Online">Online</option>
              <option value="inPerson">In Person</option>
            </select>
          </article>

          {/* Teacher ID */}
          <article className="form-group">
            <label className="form-label">Teacher Name</label>
            <input
              type="text"
              name="teacherId"
              value={newSubject.teacherId}
              className="form-input"
              onChange={handleAddSubjectChange}
            />
          </article>
          {/* <p>{message}</p> */}

          <div className="flex gap-4 mt-4">
            <button
              type="button"
              className="form-button"
              onClick={() => onModalClose(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="form-button"
              onClick={handleAddSubject}
            >
              Add subject
            </button>
          </div>
        </div>
      </div>

      {/* <form onSubmit={handleSubmit}>
        {subjects.map((subject) => (
          <div key={subject.id}>
            <label>
              <input
                type="checkbox"
                value={subject.id}
                onChange={handleCheckboxChange}
                className="form-input"
              />
              {subject.subject_name}
              <span>{subject.subject_code}</span>
            </label>
            <input
              type="number"
              placeholder="Number of questions"
              className="form-input"
            />
            <input
              type="number"
              placeholder="Duration"
              className="form-input"
            />
            <input
              type="time"
              placeholder="Start time"
              className="form-input"
            />
            <input type="date" placeholder="Date" className="form-input" />
            <input
              type="text"
              placeholder="Teacher name"
              className="form-input"
            />
          </div>
        ))}
        <button type="submit" className="form-button">
          Add Subjects to Exam
        </button>
        <button type="button" className="form-button">
          Cancel
        </button>
      </form> */}
    </div>
  );
}

export default AddExamSubject;
