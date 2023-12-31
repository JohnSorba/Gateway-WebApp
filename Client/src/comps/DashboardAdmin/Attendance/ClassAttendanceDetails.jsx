import { useState, useEffect } from "react";
import { useUser } from "../../../Contexts/UserContext";
import axios from "axios";
import Loader from "../../../Loader";
import { useParams } from "react-router-dom";
import { baseURL } from "../../Dashboard/DashboardData";

function ClassAttendanceDetails() {
  const [attendanceData, setAttendanceData] = useState([]);
  const { isLoading, setIsLoading } = useUser();
  const { classId } = useParams();

  useEffect(() => {
    fetchClassAttendanceDetails();
  }, []);

  const fetchClassAttendanceDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/attendance/class/details/${classId}`
      );

      const data = response.data;
      console.log("class attendance DETAILS: ", data);

      setAttendanceData(data);
    } catch (error) {
      console.log(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header>
        <h1>Class Attendance Details ({classId})</h1>
      </header>
      {/* Show daily attendance data  */}
      <div className="table-container">
        {isLoading ? (
          <Loader />
        ) : attendanceData.length < 1 ? (
          <h1>There are no records at this time!</h1>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S/n</th>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>(#) Total Present</th>
                <th>(#) Total Absent</th>
                <th>(#) Total Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((data, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{data.student_id}</td>
                  <td>
                    {data.first_name} {data.last_name}
                  </td>
                  <td>{data.totalpresent}</td>
                  <td>{data.totalabsent}</td>
                  <td>{data.totalstatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ClassAttendanceDetails;
