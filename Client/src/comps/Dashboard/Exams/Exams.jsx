import { useEffect, useState } from "react";
import axios from "axios";
import "../../DashboardAdmin/Exams/ExamHome.css";
import { Link } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";
import { baseURL, localDateString } from "../DashboardData";

function Exams() {
  const [exams, setExams] = useState([]);
  const { userDetails } = useUser();

  const classId = userDetails && userDetails.class_code;
  const studentId = userDetails && userDetails.student_id;

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/student/all-student-exams/${classId}/${studentId}`
        );

        const data = response.data;
        // console.log(data);

        if (data) {
          setExams(data);
        }
      } catch (error) {
        console.error("error: ", error);
      }
    };

    fetchExams();
  }, [classId, studentId]);

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
              <span className="text-sm mb-1">
                Created: {localDateString(item.date_created)}
              </span>
              <span className="self-end">
                Total Subjects:{" "}
                <span className="text-xl font-semibold">
                  {item.totalsubjects}
                </span>
              </span>
              <div className="flex justify-between items-center mt-auto self-end">
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
