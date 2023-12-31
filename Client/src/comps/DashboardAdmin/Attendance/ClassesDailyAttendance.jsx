import { useState, useEffect } from "react";
import { useUser } from "../../../Contexts/UserContext";
import axios from "axios";
import Loader from "../../../Loader";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL, localDateString } from "../../Dashboard/DashboardData";
import { FaEye } from "react-icons/fa";

function ClassesDailyAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const { isLoading, setIsLoading } = useUser();
  const { date } = useParams();
  const navigate = useNavigate();

  const newDate = localDateString(date);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/attendance/classes-date-attendance?date=${newDate}`
      );

      const data = response.data;
      // console.log("class attendance daily: ", data);

      setAttendanceData(data);
    } catch (error) {
      console.log(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewClassAttendanceDetails = (classId) => {
    navigate(`${classId}`);
  };

  return (
    <div>
      <header>
        <h1>Total Class Attendance For Today ({localDateString(date)})</h1>
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
                <th>Class Code</th>
                <th>Class Name</th>
                <th>(#) Total Present</th>
                <th>(#) Total Absent</th>
                <th>(#) Total Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((data, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{data.class_code}</td>
                  <td>{data.class_name}</td>
                  <td>{data.totalpresent}</td>
                  <td>{data.totalabsent}</td>
                  <td>{data.totalstatus}</td>
                  <td className="flex justify-center items-center text-white font-semibold">
                    <span className=" cursor-pointer">
                      <FaEye
                        className="h-7 w-7 text-blue-500 hover:text-blue-700"
                        onClick={() =>
                          viewClassAttendanceDetails(data.class_code)
                        }
                      />
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

export default ClassesDailyAttendance;
