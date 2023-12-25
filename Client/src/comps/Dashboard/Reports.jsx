import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../Loader";
import { useUser } from "../../Contexts/UserContext";

function Reports() {
  const [result, setResult] = useState([]);
  const [query, setQuery] = useState("");
  const { isLoading, userDetails } = useUser();

  const studentId = userDetails.student_id;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/exams/result/${studentId}`
        );

        // console.log(response.data);

        setResult(response.data);
      } catch (error) {
        console.error("Error fetching student results: ", error.message);
      }
    };

    fetchStudents();
  }, [studentId]);

  // if (!result) {
  //   return <Loader />;
  // }
  return (
    <div>
      <h1>Your Exam Results</h1>
      <input
        type="search"
        placeholder="Filter by ID, name, subject..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="form-input mb-8 w-[300px]"
      />

      <table className="mb-16">
        <thead>
          <tr>
            <th>###</th>
            <th>Exam ID</th>
            <th>Student ID</th>
            <th>Full Name</th>
            <th>Subject Name</th>
            <th>Subject Code</th>
            <th>Class</th>
            <th>Marks (%)</th>
            <th>Action</th>
          </tr>
        </thead>
        {isLoading ? (
          <Loader />
        ) : (
          <tbody>
            {result.length < 1 ? (
              <div>There are no available results that match your query.</div>
            ) : (
              result
                .filter(
                  (item) =>
                    item.student_id.includes(query) ||
                    item.first_name
                      .toLowerCase()
                      .includes(query.toLowerCase()) ||
                    item.subject_name
                      .toLowerCase()
                      .includes(query.toLowerCase())
                )
                .map((data, i) => (
                  <tr key={i}>
                    <td>00{i + 1}</td>
                    <td>{data.exam_id}</td>
                    <td>{data.student_id}</td>
                    <td>
                      {data.first_name} {data.last_name}
                    </td>
                    <td>{data.subject_name}</td>
                    <td>{data.subject_code}</td>
                    <td>{data.class_assigned}</td>
                    <td>{data.marks_obtained}</td>
                    <td>
                      <button className="px-6 py-3 bg-blue-500">Details</button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        )}
      </table>
      {/* 
      <div className="mb-8">
        <h3 className="text-lg font-semibold">Things to do</h3>
        <ul>
          <li>Filter by student ID</li>
          <li>Filter by name</li>
          <li>Filter by subject</li>
          <li>Implement details buttons</li>
        </ul>
      </div> */}
    </div>
  );
}

export default Reports;
