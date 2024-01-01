import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../DashboardAdmin.css";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/get-students"
        );

        setStudents(response.data);
      } catch (error) {
        console.error(
          "Error fetching student data: ",
          error.response.data.error
        );
      }
    };

    fetchStudents();
  }, []);

  const viewStudentDetails = (studentId) => {
    navigate(`details/${studentId}`);
  };

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
              <th>Age</th>
              <th>Gender</th>
              <th>Class / Grade</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => (
              <tr key={student.student_id}>
                <td className="bg-blue-50 border-r-2">00{i + 1}</td>
                <td>
                  <span className="flex gap-2 items-center justify-center">
                    {" "}
                    <img
                      src={student.profile_photo}
                      alt="No-Img"
                      className="w-[40px] h-[40] rounded-full"
                    />
                    <span>
                      {student.first_name} {student.last_name}
                    </span>
                  </span>
                </td>
                <td>{student.student_id}</td>
                <td>{student.age}</td>
                <td>{student.gender}</td>
                <td>{student.class_name}</td>
                <td>
                  <button
                    onClick={() => viewStudentDetails(student.student_id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminStudents;
