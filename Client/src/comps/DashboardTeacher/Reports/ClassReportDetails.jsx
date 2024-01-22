import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";
import { useSearch } from "../../../Contexts/SearchContext";
import Loader from "../../../Loader";
import { baseURL } from "../../Dashboard/DashboardData";

function ClassReportDetails() {
  const [result, setResult] = useState([]);
  const [query, setQuery] = useState("");
  const { isLoading, userDetails } = useUser();
  const { searchQuery } = useSearch();

  const navigate = useNavigate();
  const { examId } = useParams();

  const classId = userDetails?.class_code;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/teacher/report/exam/details/${examId}/${classId}`
        );

        // console.log(response.data);

        setResult(response.data);
      } catch (error) {
        console.error("Error fetching student results: ", error.message);
      }
    };

    fetchResults();
  }, [examId, classId]);

  const handleViewStudentReport = (param) => {
    navigate(`${param}`);
  };

  return (
    <div>
      <header className="header">
        <h2>Exam {examId} Report Details</h2>
        <h3></h3>
      </header>

      <input
        type="search"
        placeholder="Filter by ID, name, subject..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="form-input mb-4 w-[300px]"
      />

      <table className="mb-16">
        <thead>
          <tr>
            <th>###</th>
            <th>Student ID</th>
            <th>Full Name</th>
            <th>Class</th>
            <th>Average Grade</th>
            <th>Remarks</th>
            <th>Action</th>
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
              result
                .filter(
                  (item) =>
                    item.student_id.includes(searchQuery) ||
                    item.class_assigned.includes(searchQuery) ||
                    item.first_name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((data, i) => (
                  <tr key={i}>
                    <td>00{i + 1}</td>
                    <td>{data.student_id}</td>
                    <td>
                      {data.first_name} {data.last_name}
                    </td>
                    <td>{data.class_assigned}</td>
                    <td>{Number(data.average_grade).toFixed(2)}</td>
                    <td>
                      <span
                        className={`${
                          data.average_grade > 50 ? "pass" : "fail"
                        }`}
                      >
                        {data.average_grade > 50 ? "Pass" : "Fail"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="px-6 py-3 bg-blue-500"
                        onClick={() => handleViewStudentReport(data.student_id)}
                      >
                        View Full Report
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        )}
      </table>
    </div>
  );
}

export default ClassReportDetails;
