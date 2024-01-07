import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../DashboardAdmin.css";
import { baseURL } from "../../Dashboard/DashboardData";
import { useSearch } from "../../../Contexts/SearchContext";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const { searchQuery } = useSearch();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${baseURL}/admin/get-students`);

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
      <header className="header">
        <h2 className="my-16">Admin Students Content</h2>
      </header>

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
            {students
              .filter(
                (data) =>
                  data.first_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  data.class_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  data.gender.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((student, i) => (
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
