/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { baseURL } from "../../Dashboard/DashboardData";
import { useUser } from "../../../Contexts/UserContext";
import Loader from "../../../Loader";

const addSubjectForm = {
  subjectCode: "",
  date: "",
  startTime: "",
  duration: Number(30),
  totalQuestions: Number(0),
};

/* eslint-disable react/prop-types */
function AddExamSubject({
  examId,
  onModalClose,
  fetchExam,
  onSetMessage,
  onSetType,
  onShowAlert,
}) {
  const [newSubject, setNewSubject] = useState(addSubjectForm);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [warning, setWarning] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const { isLoading, setIsLoading } = useUser();

  // console.log(newSubject);
  const subjectCode = newSubject.subjectCode && newSubject.subjectCode;

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

    if (subjectCode && subjectCode.length > 0) {
      getTotalSubjectQuestions();
    }
  }, [selectedClass, subjectCode]);

  const getSubjectsByClass = async (selectedClass) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `http://localhost:3000/timetable/${selectedClass}`
      );

      const subjectData = await res.data.subjects;
      // console.log("timetable: ", TimetableData);

      setSubjects(subjectData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalSubjectQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/exams/total-questions/${subjectCode}`
      );

      const totalQuestions = response.data;

      setTotalQuestions(totalQuestions);

      if (totalQuestions == 0) {
        setWarning("Currenty selected subject has no questions!");
      } else {
        setWarning(`${totalQuestions} question(s) available for this subject!`);
      }

      setNewSubject({ ...newSubject, totalQuestions: totalQuestions });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  const handleAddSubjectChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
  };

  //   Add Subject to Exam
  const handleAddSubject = async () => {
    if (
      !newSubject.subjectCode ||
      !newSubject.date ||
      !newSubject.duration ||
      !newSubject.startTime ||
      !newSubject.totalQuestions
    ) {
      setWarning("Please fill out all details!");
      return;
    }

    if (totalQuestions < 3) {
      setWarning("Subject must have at least 3 questions!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/exams/${examId}/subject`,
        { newSubject }
      );

      // alert pop up
      onSetMessage(response.data.message);
      onSetType(response.data.type);
      onShowAlert(true);

      onModalClose();
      setWarning("");
      setNewSubject(addSubjectForm);
      fetchExam(examId);
    } catch (error) {
      console.error("Error creating exams: ", error);
    }
  };

  return (
    <div className="modals">
      <div>
        <div className="modal-backdrop"></div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="modal">
            <header className="mb-4">
              <h3 className="text-lg font-semibold">Enter Subject Details</h3>
              <p className="text-red-500">
                Adding subjects is subject to question availability
              </p>
            </header>

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
                  <option
                    key={subject.subject_code}
                    value={subject.subject_code}
                  >
                    {subject.subject_name}
                  </option>
                ))}
              </select>
            </article>

            {/* Start time and Date Inputs */}
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

            {/* Total questions and Duration inputs */}
            <div className="flex gap-4">
              {/* Total Questions */}
              <article className="form-group">
                <label htmlFor="totalQuestions" className="form-label">
                  Total Questions
                </label>
                <input
                  type="number"
                  min={3}
                  max={totalQuestions}
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
                  min={30}
                  max={45}
                  name="duration"
                  value={newSubject.duration}
                  className="form-input"
                  onChange={handleAddSubjectChange}
                />
              </article>
            </div>

            <p className="text-red-500">{warning}</p>

            <div className="flex gap-4 mt-4">
              <button
                type="button"
                className="bg-red-600"
                onClick={() => onModalClose(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600"
                onClick={handleAddSubject}
              >
                Add subject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddExamSubject;
