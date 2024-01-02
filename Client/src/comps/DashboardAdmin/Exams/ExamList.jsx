import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import "./ExamHome.css";
import Alert from "../../Utilities/Alert";
import ConfirmDelete from "../../Utilities/ConfirmDelete";
import { localDateString } from "../../Dashboard/DashboardData";

function ExamList() {
  const [exams, setExams] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [message, setMessage] = useState("");
  const [newExamModal, setNewExamModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [examDelete, setExamDelete] = useState({ open: false, examId: null });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/exams/get-all-exams`
      );

      const data = response.data;
      //   console.log(data);

      setExams(data);
    } catch (error) {
      console.error("Error fetching exams: ", error);
    }
  };

  const handleCreateExam = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/exams/create-exam`,
        { examTitle }
      );

      console.log(response.data);

      const res = response.data.title;
      const status = response.statusText;

      const message = res + " " + status;
      console.log(res, status);

      setNewExamModal(false);
      setMessage(message);
      setExamTitle("");
      fetchExams();
      setShowAlert(true);
    } catch (error) {
      console.error("Error creating exams: ", error.response.data.message);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleExamDeleteModal = (examId) => {
    setExamDelete({ open: true, examId: examId });
  };

  //   Delete exam
  const handleDeleteExam = async (examId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/exams/delete-exam/${examId}`
      );

      console.log(response);

      fetchExams();
      setMessage(response.data);
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting exam", error.response.data.message);
    }
  };

  return (
    <div>
      <header className="py-8 mb-8 border-b-2">
        <button onClick={() => setNewExamModal(true)} className="form-button">
          Create Exam
        </button>
      </header>
      {/* Display exams fetched from API */}
      <ul className="exam-list">
        {exams.map((item) => (
          <li key={item.exam_id} className="exam-item">
            <h3>{item.title} </h3>
            <span className="text-sm font-semibold">
              Created: {localDateString(item.date_created)}
            </span>
            <div className="flex justify-between items-center mt-auto">
              <FaEdit className="w-6 h-6 text-blue-400 icon" />
              <MdDeleteForever
                className="w-6 h-6 text-red-400 icon"
                onClick={() => handleExamDeleteModal(item.exam_id)}
              />
              <Link
                to={`/dashboard/admin/exams/exam-details/${item.exam_id}`}
                className="form-button"
              >
                View Exam
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {newExamModal && (
        <div>
          <div className="modal-backdrop"></div>
          <div className="modal">
            <h3 className="text-lg font-semibold mb-4">
              Enter New Exam Details
            </h3>
            <article className="form-group">
              <label className="form-label">Exam Title</label>
              <input
                type="text"
                name="examId"
                value={examTitle}
                className="form-input"
                onChange={(e) => setExamTitle(e.target.value)}
              />
            </article>

            <div className="flex gap-4 mt-4">
              <button
                type="button"
                className="form-button"
                onClick={() => setNewExamModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="form-button"
                onClick={handleCreateExam}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {examDelete.open && (
        <ConfirmDelete
          item="exam"
          onCancel={() => setExamDelete({ open: false, examId: null })}
          onDelete={() => handleDeleteExam(examDelete.examId)}
        />
      )}

      <Alert
        type="success"
        message={message}
        onClose={handleCloseAlert}
        isVisible={showAlert}
      />
    </div>
  );
}

export default ExamList;

/**
 * 
 * const createExamForm = {
  examId: "",
  subjectCode: "",
  date: "",
  time: "",
  duration: null,
  totalQuestions: null,
  totalMarks: null,
  examType: "",
  teacherid: "",
};
 */
