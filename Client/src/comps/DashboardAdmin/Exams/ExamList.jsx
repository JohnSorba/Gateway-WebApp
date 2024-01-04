import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
// import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import "./ExamHome.css";
import Alert from "../../Utilities/Alert";
import ConfirmDelete from "../../Utilities/ConfirmDelete";
import { localDateString } from "../../Dashboard/DashboardData";

function ExamList() {
  const [examList, setExamList] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [newExamModal, setNewExamModal] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
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

      const examList = response.data.examDetails;
      console.log(response.data);

      setExamList(examList);
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

      setMessage(response.data.message);
      setType(response.data.type);
      setShowAlert(true);

      setNewExamModal(false);
      setExamTitle("");
      fetchExams();
    } catch (error) {
      console.error("Error creating exams: ", error.response.data.message);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  // const handleExamDeleteModal = (examId) => {
  //   setExamDelete({ open: true, examId: examId });
  // };

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
      setExamDelete({ open: false, examId: null });
    } catch (error) {
      console.error("Error deleting exam", error.response.data.message);
    }
  };

  return (
    <div>
      <header className="header">
        <h2 className="m-0">Exam List</h2>
        <div className="flex items-end gap-6">
          <button
            onClick={() => setNewExamModal(true)}
            className="bg-green-600 font-semibold"
          >
            Create Exam
          </button>
        </div>
      </header>

      <div className="flex justify-end mb-4">
        <p>tehst</p>
        <select className="form-select bg-red-500 self-end">
          <option>All</option>
          <option>Ongoing</option>
          <option>Completed</option>
        </select>
      </div>
      {/* Display exams fetched from API */}
      <ul className="exam-list">
        {examList.map((item) => (
          <li key={item.exam_id} className={`exam-item`}>
            <h3>{item.title} </h3>
            <div>
              <span className="text-sm font-semibold">
                Created: {localDateString(item.date_created)}
              </span>
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.published === true ? "bg-green-500" : "bg-red-500"
                  } `}
                ></div>
                <p className="text-sm">
                  {item.published === true ? "Ongoing" : "Draft"}
                </p>
              </div>
            </div>

            <div
              className="flex justify-end items-center
            
             gap-3 mt-auto"
            >
              <FaEdit className="w-6 h-6 text-blue-600 icon" />
              {/* <MdDeleteForever
                className="w-6 h-6 text-red-400 icon"
                onClick={() => handleExamDeleteModal(item.exam_id)}
              /> */}
              <Link to={`exam-details/${item.exam_id}`}>
                <FaEye className="w-6 h-6 text-green-600 icon" />
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
        type={type}
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
