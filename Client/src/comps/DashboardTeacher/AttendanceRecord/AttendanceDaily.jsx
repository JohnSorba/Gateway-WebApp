import { useState, useEffect } from "react";
import { useUser } from "../../../Contexts/UserContext";
import axios from "axios";
import Loader from "../../../Loader";
import { useParams } from "react-router-dom";
import { baseURL, localDateString } from "../../Dashboard/DashboardData";

function AttendanceDaily() {
  const [attendanceData, setAttendanceData] = useState([]);
  const { isLoading, setIsLoading, userDetails } = useUser();
  const { date } = useParams();

  const newDate = localDateString(date);
  const classId = userDetails?.class_code;

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/teacher/get-attendance/${classId}?date=${newDate}`
      );

      const data = response.data;
      //   console.log("attendance daily: ", data);

      setAttendanceData(data);
    } catch (error) {
      console.log(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {" "}
      <header>
        <h1>Daily Student Attendance For ({localDateString(date)})</h1>
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
                <th>Student Name</th>
                <th>Status</th>
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
                  <td>
                    {" "}
                    <span
                      className={`py-1 px-3 rounded-lg ${
                        data.status === "present"
                          ? "bg-emerald-300"
                          : "bg-red-300"
                      }`}
                    >
                      {data.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AttendanceDaily;
