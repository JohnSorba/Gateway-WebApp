import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CreateExam.css";

import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

function CreateExam() {
  const [exams, setExams] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [message, setMessage] = useState("");

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
        { title: examTitle }
      );

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

      //   setMessage(response.data);
    } catch (error) {
      console.error("Error deleting exam", error);
    }
  };

  return (
    <div className="flex justify-between">
      <div className="createExam-form">
        <label>
          Exam Title:
          <input
            type="text"
            value={examTitle}
            name="examTitle"
            onChange={(e) => setExamTitle(e.target.value)}
            className="form-input"
          />
        </label>
        <button onClick={handleCreateExam}>Create Exam</button>
        <p>{message}</p>
      </div>

      {/* Display exams fetched from API */}
      <ul className="exam-list">
        {exams.map((item) => (
          <li key={item.exam_id} className="exam-item">
            <h3>{item.title} </h3>
            <span>{item.date_created}</span>
            <div className="flex justify-between items-center mt-auto">
              <Link
                to={`/dashboard/admin/exams/exam-details/${item.exam_id}`}
                className="form-button"
              >
                View Exam
              </Link>
              <FaEdit className="w-6 h-6 text-blue-400 icon" />
              <MdDeleteForever
                className="w-6 h-6 text-red-400 icon"
                onClick={() => handleDeleteExam(item.exam_id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateExam;
