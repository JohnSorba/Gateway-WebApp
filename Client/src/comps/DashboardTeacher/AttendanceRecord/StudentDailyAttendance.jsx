import { useState, useEffect } from "react";
import { useUser } from "../../../Contexts/UserContext";
import axios from "axios";
import Loader from "../../../Loader";
import { useParams } from "react-router-dom";
import { baseURL, localDateString } from "../../Dashboard/DashboardData";

function StudentDailyAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const { isLoading, setIsLoading, userDetails } = useUser();
  const { studentId } = useParams();

  const classId = userDetails?.class_code;
  console.log(attendanceData);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/teacher/get-attendance/${classId}/${studentId}`
      );

      const data = response.data;
      console.log("student attendance daily: ", data);

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
        <h1>Daily Student Attendance For ({studentId})</h1>
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
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((data, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{localDateString(data.date)}</td>
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

export default StudentDailyAttendance;
