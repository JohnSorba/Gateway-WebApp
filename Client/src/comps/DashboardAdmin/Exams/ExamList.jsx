import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import "./ExamHome.css";

function ExamList() {
  const [exams, setExams] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [message, setMessage] = useState("");
  const [newExamModal, setNewExamModal] = useState(false);

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
        `http://localhost:3000/exams/23/subject`,
        { examTitle }
      );

      console.log(response.data);

      const res = response.data.title;
      const status = response.statusText;
      const message = res + " " + status;
      console.log(res, status);
      setMessage(message);
      setExamTitle("");
      fetchExams();
    } catch (error) {
      console.error("Error creating exams: ", error);
    }
  };

  //   Delete exam
  const handleDeleteExam = async (examId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/exams/delete-exam/${examId}`
      );

      console.log(response);

      fetchExams();
      //   setMessage(response.data);
    } catch (error) {
      console.error("Error deleting exam", error);
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
            <span>{item.date_created}</span>
            <div className="flex justify-between items-center mt-auto">
              <FaEdit className="w-6 h-6 text-blue-400 icon" />
              <MdDeleteForever
                className="w-6 h-6 text-red-400 icon"
                onClick={() => handleDeleteExam(item.exam_id)}
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

            <p>{message}</p>

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
