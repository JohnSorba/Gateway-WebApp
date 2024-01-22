import { useParams } from "react-router-dom";
import Loader from "../../../Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../Contexts/UserContext";
import { jsPDF } from "jspdf";
import { baseURL } from "../../Dashboard/DashboardData";

function StudentReportDetails() {
  const [result, setResult] = useState([]);
  const { isLoading, setIsLoading, userDetails } = useUser();

  const { examId, studentId } = useParams();
  const examDetails = result[0];
  const classId = userDetails?.class_code;

  //   console.log("result: ", result);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseURL}/teacher/report/student-result/${examId}/${classId}/${studentId}`
        );

        setResult(response.data);
      } catch (error) {
        console.error("Error fetching student results: ", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [examId, studentId, classId, setIsLoading]);

  const handlePrint = () => {
    const pdf = new jsPDF();
    pdf.html(document.getElementById("details"), {
      callback: () => {
        pdf.save(`_final_report_${studentId}.pdf`);
      },
    });
  };

  return (
    <div id="details">
      <>
        <header className="header">
          <h2>
            {examDetails?.first_name} {examDetails?.last_name}&apos;s Report
            Details
          </h2>
          <button className="form-button" onClick={handlePrint}>
            Print Report
          </button>
        </header>

        <div className="flex items-start justify-between mb-12">
          <div className="grid grid-cols-2 gap-16">
            <article>
              <p>
                <span>Exam Name</span>: <span>{examDetails?.title}</span>
              </p>
              <p>
                <span>Date Created: </span>
                <span>{examDetails?.date_created}</span>
              </p>
              <p>
                <span>Full Name: </span>
                <span>
                  {examDetails?.first_name} {examDetails?.last_name}
                </span>
              </p>
            </article>
            <article>
              <p>
                <span>Student ID: </span>
                <span>{examDetails?.student_id}</span>
              </p>
              <p>
                <span>Class: </span>
                <span>{examDetails?.class_assigned}</span>
              </p>
              <p>
                <span>Age: </span>
                <span>{examDetails?.age}</span>
              </p>
            </article>
          </div>
        </div>

        <table className="mb-16" id="table">
          <thead>
            <tr>
              <th>##</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Marks Obtained</th>
              <th>Remarks</th>
            </tr>
          </thead>
          {isLoading ? (
            <Loader />
          ) : (
            <tbody>
              {result.length < 1 ? (
                <tr>
                  <td>There are no available results that match your query.</td>
                </tr>
              ) : (
                result.map((data, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{data.subject_code}</td>
                    <td>{data.subject_name}</td>
                    <td>{data.marks_obtained}</td>
                    <td>
                      <span
                        className={`${
                          data.marks_obtained > 50 ? "pass" : "fail"
                        }`}
                      >
                        {data.marks_obtained > 50 ? "Pass" : "Fail"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </>

      <ul>
        <h2>THINGS TO INCLUDE</h2>
        <li>Student information</li>
        <li>Student grades</li>
        <li>Student attendance</li>
        <li>Overall performance</li>
      </ul>
    </div>
  );
}

export default StudentReportDetails;
