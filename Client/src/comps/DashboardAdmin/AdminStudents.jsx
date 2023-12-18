import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";
import "./DashboardAdmin.css";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const { authState } = useAuth();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${authState.token}` },
        };

        const response = await axios.get(
          "http://localhost:3000/api/students",
          config
        );
        setStudents(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error fetching student data: ",
          error.response.data.error
        );
      }
    };

    if (authState.token) {
      fetchStudents();
    }
  }, [authState.token]);

  if (!students) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="my-16">Admin Students Content</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>###</th>
              <th>Full Name</th>
              <th>Student ID</th>
              <th>Admission ID</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Class / Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => (
              <tr key={student.student_id}>
                <td className="bg-blue-50 border-r-2">00{i + 1}</td>
                <td>
                  {student.first_name} {student.last_name}
                </td>
                <td>{student.student_id}</td>
                <td>{student.admission_id}</td>
                <td>{student.age}</td>
                <td>{student.gender}</td>
                <td>{student.class_name}</td>
                <td>{student.admission_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStudents;
