import { useEffect, useState } from "react";
import axios from "axios";
import "../../DashboardAdmin/Exams/ExamHome.css";
import { Link } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";

function Exams() {
  const [exams, setExams] = useState([]);
  const { userDetails } = useUser();

  // const studentId = userDetails.student_id;
  const classId = userDetails && userDetails.class_code;

  useEffect(() => {
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchExams = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/exams/student-exam/${classId}`
      );

      const data = response.data;
      // console.log(data);

      setExams(data);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <div>
      <h1>View your upcoming exams </h1>
      <h3> ({exams.length} Exam Available)</h3>

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
