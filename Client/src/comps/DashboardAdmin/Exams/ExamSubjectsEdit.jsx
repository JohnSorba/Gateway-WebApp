import axios from "axios";
import { useEffect, useState } from "react";
import { baseURL } from "../../Dashboard/DashboardData";
import { useUser } from "../../../Contexts/UserContext";
import Loader from "../../../Loader";

const editSubjectForm = {
  date: "",
  startTime: "",
  duration: Number(30),
  totalQuestions: Number(0),
};

/* eslint-disable react/prop-types */
function ExamSubjectsEdit({
  examId,
  subjectId,
  onModalClose,
  fetchExam,
  onSetMessage,
  onSetType,
  onShowAlert,
}) {
  const [editSubject, setEditSubject] = useState(editSubjectForm);
  const [subjectDetails, setSubjectDetails] = useState([]);
  const [warning, setWarning] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const { isLoading, setIsLoading } = useUser();

  // fetch classes
  useEffect(() => {
    // Code to run on component mount
    const fetchSubjectDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseURL}/exams/subject/update-info/${examId}/${subjectId}`
        );
        const data = response.data;

        setEditSubject({
          ...editSubject,
          startTime: data.start_time,
          duration: data.duration,
          totalQuestions: data.no_of_questions,
        });

        setSubjectDetails(data);
      } catch (error) {
        console.error("Error fetching classes: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjectDetails();
  }, [examId, subjectId, setIsLoading]);

  // fetch the total questions for selected subject
  useEffect(() => {
    const getTotalSubjectQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseURL}/exams/total-questions/${subjectId}`
        );

        const totalQuestions = response.data;

        setTotalQuestions(totalQuestions);

        if (totalQuestions == 0) {
          setWarning("Currenty selected subject has no questions!");
        } else {
          setWarning(`${totalQuestions} questions available for this subject!`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getTotalSubjectQuestions();
  }, [subjectId, editSubject, setIsLoading]);

  // handle the change in object input
  const handleEditSubjectChange = (e) => {
    const { name, value } = e.target;
    setEditSubject({ ...editSubject, [name]: value });
  };

  //   Add Subject to Exam
  const handleEditExamSubject = async () => {
    if (
      !editSubject.date ||
      !editSubject.duration ||
      !editSubject.startTime ||
      !editSubject.totalQuestions
    ) {
      setWarning("Please fill out all details!");
      return;
    }

    if (totalQuestions < 3) {
      setWarning("Subject must have at least 3 questions!");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/exams/update/exam-subject/${examId}/${subjectId}`,
        { editSubject }
      );

      // alert pop up
      onSetMessage(response.data.message);
      onSetType(response.data.type);
      onShowAlert(true);

      onModalClose();
      setWarning("");
      setEditSubject(editSubjectForm);
      fetchExam(examId);
    } catch (error) {
      console.error("Error creating exams: ", error);
      throw Error;
    }
  };

  return (
    <div className="modals">
      <div>
        <div className="modal-backdrop"></div>

        <div className="modal">
          <header className="mb-4">
            <h3 className="text-lg font-semibold">
              Editing {subjectDetails && subjectDetails.subject_name} Details
            </h3>
            <p className="text-red-500">Fill in details in all fields.</p>
          </header>
          {isLoading ? (
            <Loader />
          ) : (
            <main>
              <div className="flex gap-4">
                {/* Start Time Input */}
                <article className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={editSubject.startTime}
                    className="form-input"
                    onChange={handleEditSubjectChange}
                  />
                </article>

                {/* Date Input */}
                <article className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editSubject.date}
                    className="form-input"
                    onChange={handleEditSubjectChange}
                  />
                </article>
              </div>

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
                    value={editSubject.totalQuestions}
                    className="form-input"
                    onChange={handleEditSubjectChange}
                  />
                </article>

                {/* Duration */}
                <article className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="number"
                    min={30}
                    max={60}
                    name="duration"
                    value={editSubject.duration}
                    className="form-input"
                    onChange={handleEditSubjectChange}
                  />
                </article>
              </div>

              <p className="text-red-500 text-center mt-2 mb-8">{warning}</p>
            </main>
          )}

          <footer className="flex gap-4 justify-center">
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
              onClick={handleEditExamSubject}
            >
              Update subject
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default ExamSubjectsEdit;
