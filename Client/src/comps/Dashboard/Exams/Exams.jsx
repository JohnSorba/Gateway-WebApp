import { useEffect, useState } from "react";
import axios from "axios";
import "../../DashboardAdmin/Exams/ExamHome.css";
import { Link } from "react-router-dom";

function Exams() {
  const [exams, setExams] = useState([]);
  const selectedClass = 105;

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        // `http://localhost:3000/exams/student-exam`
        `http://localhost:3000/exams/student-exam/${selectedClass}`
      );

      const data = response.data;
      console.log(data);

      setExams(data);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <div>
      <h1>View your upcoming exams</h1>

      {/* Display exams fetched from API */}
      <ul className="exam-list">
        {exams.length < 1 ? (
          <div>There are no exams for you at the moment</div>
        ) : (
          exams.map((item) => (
            <li key={item.exam_id} className="exam-item">
              <h3>{item.title} </h3>
              <span>{item.date_created}</span>
              <div className="flex justify-between items-center mt-auto">
                <Link
                  to={`/dashboard/student/exams/exam-details/${item.exam_id}`}
                  className="form-button"
                >
                  View Exam
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Exams;
