import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";
import Loader from "../../../Loader";

function AdminStudentDetails() {
  const [students, setStudents] = useState([]);
  const { studentId } = useParams();
  const { setIsLoading, isLoading } = useUser();

  console.log(students);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/admin/student/${studentId}`
        );

        setStudents(response.data);
      } catch (error) {
        console.error(
          "Error fetching student data: ",
          error.response.data.error
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [studentId, setIsLoading]);

  return (
    <div>
      <h1>Admin Student Details ({studentId})</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {students.map((data) => (
            <div key={data.student_id}>
              <img
                className="rounded-full"
                src={data.profile_photo}
                alt={data.first_name}
              />
              <p>{data.student_id}</p>
              <p>
                {data.first_name} {data.last_name}
              </p>
              <p>{data.age}</p>
              <p>{data.gender}</p>
              <p>{data.phone_number}</p>
              <p>{data.address}</p>
              <p>{data.parent_name}</p>
              <p>{data.parent_contact}</p>

              <h1>Admission Information</h1>
              <p>{data.class_name}</p>
              <p>{data.class_code}</p>
              <p>{data.admission_id}</p>
              <p>{data.admission_status}</p>
              <p>{data.admission_date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminStudentDetails;
