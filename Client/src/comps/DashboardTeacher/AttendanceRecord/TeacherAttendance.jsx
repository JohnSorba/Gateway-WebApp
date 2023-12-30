import { useState, useEffect } from "react";
import AttendanceAdd from "./AttendanceAdd";
import Alert from "../../Utilities/Alert";
import { useUser } from "../../../Contexts/UserContext";
import axios from "axios";
import Loader from "../../../Loader";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { localDateString, baseURL } from "../../Dashboard/DashboardData";

function TeacherAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [addAttendance, setAddAttendance] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [view, setView] = useState("date");
  const { isLoading, setIsLoading, userDetails } = useUser();

  const classId = userDetails?.class_code;
  const navigate = useNavigate();

  useEffect(() => {
    if (view === "date") {
      fetchDateAttendance();
    } else if (view === "student") {
      fetchStudentsAttendance();
    }
  }, [view]);

  const fetchDateAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/teacher/get-date-attendance/${classId}`
      );

      const data = response.data;

      setAttendanceData(data);
    } catch (error) {
      console.log(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentsAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/teacher/get-students-attendance/${classId}`
      );

      const data = response.data;

      setStudentAttendance(data);
    } catch (error) {
      console.log(
        "cannot get student attendance:",
        error.response.data.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttendance = () => {
    setAddAttendance(true);
  };

  const handleCloseAttendance = () => {
    setAddAttendance(false);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const viewAttendanceDetails = (date) => {
    navigate(`date-details/${date}`);
  };

  const viewStudentAttendanceDetails = (studentId) => {
    navigate(`student-details/${studentId}`);
  };

  return (
    <div>
      <header>
        <h1>Student Attendance Update</h1>
        {/* <p>Overall Attendance: 9</p>
        <p>Absent: 3</p>
        <p>Present: 6</p> */}

        <div className="grid grid-cols-[250px_1fr_200px] items-start">
          <div className="flex gap-4 items-start">
            <p>Filter by:</p>
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="form-select"
            >
              <option value="date">Date View</option>
              <option value="student">Student View</option>
            </select>
          </div>
          <div></div>
          <button onClick={handleAddAttendance}>Add Attendance</button>
        </div>
      </header>
      {isLoading ? (
        <Loader />
      ) : attendanceData.length < 1 ? (
        <h1>There are no records at this time!</h1>
      ) : view === "date" ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>S/n</th>
                <th>Date</th>
                <th>(#) Present</th>
                <th>(#) Absent</th>
                <th>(#) Total</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((data, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{localDateString(data.date)}</td>
                  <td>{data.totalpresent}</td>
                  <td>{data.totalabsent}</td>
                  <td>{data.totalstatus}</td>
                  <td className="flex justify-center items-center text-white font-semibold">
                    <span className=" cursor-pointer">
                      <FaEye
                        className="h-7 w-7 text-blue-500 hover:text-blue-700"
                        onClick={() => viewAttendanceDetails(data.date)}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>S/n</th>
                <th>Full Name</th>
                <th>(#) Present</th>
                <th>(#) Absent</th>
                <th>(#) Total</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {studentAttendance.map((data, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    {data.first_name} {data.last_name}
                  </td>
                  <td>{data.totalpresent}</td>
                  <td>{data.totalabsent}</td>
                  <td>{data.totalstatus}</td>
                  <td className="flex justify-center items-center text-white font-semibold">
                    <span className=" cursor-pointer">
                      <FaEye
                        className="h-7 w-7 text-blue-500 hover:text-blue-700"
                        onClick={() =>
                          viewStudentAttendanceDetails(data.student_id)
                        }
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {addAttendance && (
        <div className="modal-backdrop overflow-y-scroll">
          <AttendanceAdd
            onCloseAttendance={handleCloseAttendance}
            attendanceData={attendanceData}
            showAlert={showAlert}
            onShowAlert={setShowAlert}
            onSetMessage={setMessage}
            message={message}
            onSetType={setType}
            onFetchAttendance={fetchDateAttendance}
          />
        </div>
      )}

      <Alert
        type={type}
        message={message}
        onClose={handleCloseAlert}
        isVisible={showAlert}
      />
    </div>
  );
}

export default TeacherAttendance;
