import { useState, useEffect } from "react";
import axios from "axios";
import { baseURL, localDateString } from "./DashboardData";
import Loader from "../../Loader";
import { useUser } from "../../Contexts/UserContext";

function Attendance() {
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const { isLoading, setIsLoading, userDetails } = useUser();

  const studentId = userDetails.student_id;

  console.log(stats, studentAttendance);

  useEffect(() => {
    fetchStudentsAttendance();
  }, []);

  useEffect(() => {
    const getStats = localStorage.getItem("stats");
    setStats(getStats);
  }, []);

  const fetchStudentsAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/student/get-attendance/${studentId}`
      );

      console.log(response);

      const attendanceData = response.data.attendanceData;
      const stats = response.data.stats;

      if (response) {
        setStudentAttendance(attendanceData);
        setStats(stats);
        localStorage.setItem("stats", stats);
      }
    } catch (error) {
      console.log(
        "cannot get student attendance:",
        error.response.data.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>View Your Attendance Records</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <header>
          <p>
            {stats && stats?.first_name} {stats && stats?.last_name}
          </p>
          <p>Present: {stats && stats?.totalpresent}</p>
          <p>Absent: {stats && stats?.totalabsent}</p>
          <p>Total Attendance: {stats && stats?.totalstatus}</p>
        </header>
      )}

      <div className="table-container">
        {isLoading ? (
          <Loader />
        ) : studentAttendance.length < 1 ? (
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
              {studentAttendance.map((data, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>

                  <td>{localDateString(data.attendance_date)}</td>
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

export default Attendance;
