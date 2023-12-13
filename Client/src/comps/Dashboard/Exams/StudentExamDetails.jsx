/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../Loader";
// import TakeExam from "./TakeExam";

function StudentExamDetails({ classId }) {
  const [examDetails, setExamDetails] = useState([]);
  // const [examModal, setExamModal] = useState(false);
  // const [subjectId, setSubjectId] = useState("");
  // const [numberOfQuestions, setNumberOfQuestions] = useState(null);
  const { examId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/exams/${examId}/class/${classId}`
        );

        const data = await response.data;
        //   console.log(data);

        setExamDetails(data);
      } catch (error) {
        console.error("Error fetching exams: ", error);
      }
    };

    fetchExams();
  }, [examId, classId]);

  if (examDetails.length < 1) {
    return <Loader />;
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
              <th>Duration</th>
              <th>No. of Questions</th>
              <th>Total Marks</th>
              <th>Exam Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {examDetails.map((item) => (
              <tr key={item.subject_code}>
                <td>{item.subject_code}</td>
                <td>{item.subject_name}</td>
                <td>{item.exam_date}</td>
                <td>{item.start_time.toString()}</td>
                <td>{item.duration}</td>
                <td>{item.no_of_questions}</td>
                <td>{item.total_marks}</td>
                <td>{item.exam_type}</td>
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

      {/* {examModal && (
        <div className="modal">
          <div className="modal-backdrop"></div>
          <TakeExam
            subjectId={subjectId}
            numberOfQuestions={numberOfQuestions}
          />
        </div>
      )} */}
    </div>
  );
}

export default StudentExamDetails;
