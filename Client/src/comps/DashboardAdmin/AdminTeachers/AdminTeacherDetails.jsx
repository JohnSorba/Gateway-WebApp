import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";
import Loader from "../../../Loader";
import { baseURL } from "../../Dashboard/DashboardData";

function AdminTeacherDetails() {
  const [teachers, setTeachers] = useState([]);
  const { teacherId } = useParams();
  const { setIsLoading, isLoading } = useUser();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${baseURL}/admin/teacher/${teacherId}`
        );

        setTeachers(response.data);
      } catch (error) {
        console.error(
          "Error: ",
          error.response.data.message,
          error.response.data.error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [teacherId, setIsLoading]);

  return (
    <div>
      <header className="header">
        <h2>
          {teachers[0]?.first_name} {teachers[0]?.last_name} Teacher Details (
          {teacherId})
        </h2>
      </header>

      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {teachers.map((data) => (
            <div key={data.teacher_id}>
              <img
                className="rounded-full"
                src={data.profile_photo}
                alt={data.first_name}
              />
              <p>{data.teacher_id}</p>
              <p>
                {data.first_name} {data.last_name}
              </p>
              <p>{data.date_of_birth}</p>
              <p>{data.gender}</p>
              <p>{data.phone_number}</p>
              <p>{data.address}</p>
              <p>{data.parent_name}</p>
              <p>{data.parent_contact}</p>

              <h1>Employment Details</h1>
              <p>
                {data.class_name} ({data.class_code})
              </p>
              <p>{data.employee_status}</p>
              <p>{data.qualifications}</p>
              <p>{data.joining_date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminTeacherDetails;
