import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../DashboardAdmin.css";

function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/admin/get-teachers"
        );

        const data = response.data;

        setTeachers(data);
      } catch (error) {
        console.error(
          "Error fetching student data: ",
          error.response.data.error
        );
      }
    };

    fetchTeachers();
  }, []);

  const viewTeacherDetails = (teacherId) => {
    navigate(`details/${teacherId}`);
  };
  return (
    <div>
      <h1 className="my-16">Admin Teachers Content</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>###</th>
              <th>Full Name</th>
              <th>Teacher ID</th>
              <th>Gender</th>
              <th>Class Assigned</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, i) => (
              <tr key={teacher.teacher_id}>
                <td className="bg-blue-50 border-r-2">00{i + 1}</td>
                <td>
                  <span className="flex gap-2 items-center justify-center">
                    {" "}
                    <img
                      src={teacher.profile_photo}
                      alt="No-Img"
                      className="w-[40px] h-[40] rounded-full"
                    />
                    <span>
                      {teacher.first_name} {teacher.last_name}
                    </span>
                  </span>
                </td>
                <td>{teacher.teacher_id}</td>
                <td>{teacher.gender}</td>
                <td>{teacher.class_name}</td>
                <td>
                  <button
                    onClick={() => viewTeacherDetails(teacher.teacher_id)}
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

export default AdminTeachers;
