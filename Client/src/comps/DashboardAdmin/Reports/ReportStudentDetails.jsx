import { useParams } from "react-router-dom";
import Loader from "../../../Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../Contexts/UserContext";
import { jsPDF } from "jspdf";
import { baseURL } from "../../Dashboard/DashboardData";

function ReportStudentDetails() {
  const [result, setResult] = useState([]);
  const [query, setQuery] = useState("");
  const { isLoading, setIsLoading } = useUser();

  const { examId, studentId } = useParams();
  const examDetails = result[0];

  //   console.log("result: ", result);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseURL}/admin/report/student-result/${examId}/${studentId}`
        );

        setResult(response.data);
      } catch (error) {
        console.error("Error fetching student results: ", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [examId, studentId, setIsLoading]);

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
          <div></div>
        </header>

        <div className="flex items-start justify-between">
          <div>
            <p>Exam Name: {examDetails?.title}</p>
            <p>Date Created: {examDetails?.date_created}</p>
            <p>
              Full Name: {examDetails?.first_name} {examDetails?.last_name}
            </p>
            <p>Student ID: {examDetails?.student_id}</p>
            <p>Class: {examDetails?.class_assigned}</p>
            <p>Age: {examDetails?.age}</p>
          </div>
          <button className="form-button" onClick={handlePrint}>
            Print Report
          </button>
        </div>

        <input
          type="search"
          placeholder="Filter by ID, name, subject..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-input mb-4 w-[300px]"
        />

        <table className="mb-16" id="table">
          <thead>
            <tr>
              <th>###</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              {/* <th>Total Questions</th> */}
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
                    <td>00{i + 1}</td>
                    <td>{data.subject_code}</td>
                    <td>{data.subject_name}</td>
                    {/* <td>{data.no_of_questions}</td> */}
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
    </div>
  );
}

export default ReportStudentDetails;
