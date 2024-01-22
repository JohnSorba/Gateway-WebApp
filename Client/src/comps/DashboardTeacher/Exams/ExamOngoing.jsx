/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useUser } from "../../../Contexts/UserContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../Dashboard/DashboardData";
import Loader from "../../../Loader";

function ExamOngoing() {
  const [examOngoing, setExamOngoing] = useState([]);
  const { isLoading, setIsLoading, userDetails } = useUser();
  const { examId } = useParams();

  const classId = userDetails?.class_code;

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseURL}/teacher/ongoing/${examId}/${classId}`
        );

        const data = response.data;

        setExamOngoing(data);
      } catch (error) {
        console.error("Error fetching exams: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchMarkExamComplete = async () => {
      try {
        await axios.get(`${baseURL}/exams/exam-complete/${examId}`);
      } catch (error) {
        console.error("Error fetching exams: ", error);
      }
    };

    fetchExams();
    fetchMarkExamComplete();
  }, [examId]);

  return (
    <div>
      <header className="header">
        <div>
          <h2>Ongoing Exam</h2>
        </div>

        <div></div>
      </header>
      {/* Table Display */}
      {isLoading ? (
        <Loader />
      ) : examOngoing.length < 1 ? (
        <p>There are no subjects available in this exam!</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>##</th>
                <th>Class Code</th>
                <th>Exams Taken</th>
                <th>Total Students In Class</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {examOngoing &&
                examOngoing.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.class_code}</td>
                    <td>{item.students_taken_exam}</td>
                    <td>{item.total_students}</td>
                    <td>
                      <span
                        className={`py-1 px-4 text-white rounded-full ${
                          item.total_students == item.students_taken_exam
                            ? "bg-green-500"
                            : "bg-red-400"
                        }`}
                      >
                        {item.total_students == item.students_taken_exam
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExamOngoing;
