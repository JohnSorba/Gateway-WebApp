/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import Loader from "../../../Loader";
import { useUser } from "../../../Contexts/UserContext";
import { localDateString } from "../DashboardData";
// import TakeExam from "./TakeExam";

function StudentExamDetails() {
  const [examDetails, setExamDetails] = useState([]);
  const { userDetails } = useUser();
  const { examId } = useParams();

  const studentId = userDetails.student_id;
  const classId = userDetails.class_code;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/exams/${examId}/${classId}/${studentId}`
        );

        const data = await response.data;
        //   console.log(data);

        setExamDetails(data);
      } catch (error) {
        console.error("Error fetching exams: ", error);
      }
    };

    fetchExams();
  }, [examId, classId, studentId]);

  if (examDetails.length < 1) {
    return <h2>There are no subjects available for this exam!</h2>;
  }

  const handleTakeExam = async (subjectId, examId) => {
    navigate(`/student/exam/${examId}/${subjectId}`);
  };

  return (
    <div>
      <h2>Exam Details</h2>
      {examDetails && (
        <div>
          <h3>
            <span>Exam Title: </span>
            {examDetails[0].title}
          </h3>
          {/* Display other details */}
        </div>
      )}

      {examDetails.length < 1 ? (
        <p>There are no exams available at this time!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration (mins)</th>
              <th>No. of Questions</th>
              <th>Total Marks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {examDetails.map((item) => (
              <tr key={item.subject_code}>
                <td>{item.subject_code}</td>
                <td>{item.subject_name}</td>
                <td>{localDateString(item.exam_date)}</td>
                <td>{item.start_time.toString()}</td>
                <td>{item.no_of_questions / 2}</td>
                <td>{item.no_of_questions}</td>
                <td>{item.total_marks}</td>
                <td>
                  <button
                    onClick={() =>
                      handleTakeExam(item.subject_code, item.exam_id)
                    }
                  >
                    Take Exam
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentExamDetails;
