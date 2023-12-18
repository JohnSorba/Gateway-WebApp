import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../Loader";

function AdminReports() {
  const [result, setResult] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/exams/get-result"
        );

        // console.log(response.data);

        setResult(response.data);
      } catch (error) {
        console.error("Error fetching student results: ", error.message);
      }
    };

    fetchStudents();
  }, []);

  // if (!result) {
  //   return <Loader />;
  // }
  return (
    <div>
      <h1>Admin Reports</h1>

      {result.length < 1 ? (
        <Loader />
      ) : (
        <table>
          <thead>
            <th>###</th>
            <th>Student ID</th>
            <th>Full Name</th>
            <th>Exam ID</th>
            <th>Subject Name</th>
            <th>Subject Code</th>
            <th>Class</th>
            <th>Marks</th>
          </thead>
          <tbody>
            {result.map((data, i) => (
              <tr key={i}>
                <td>00{i + 1}</td>
                <td>{data.student_id}</td>
                <td>
                  {data.first_name} {data.last_name}
                </td>
                <td>{data.exam_id}</td>
                <td>{data.subject_name}</td>
                <td>{data.subject_code}</td>
                <td>{data.class_assigned}</td>
                <td>{data.marks_obtained}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminReports;
