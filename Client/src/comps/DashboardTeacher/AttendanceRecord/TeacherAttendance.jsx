import { useState, useEffect } from "react";
import AttendanceAdd from "./AttendanceAdd";
import Alert from "../../Utilities/Alert";
import { useUser } from "../../../Contexts/UserContext";
import axios from "axios";
import Loader from "../../../Loader";

function TeacherAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [addAttendance, setAddAttendance] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const { isLoading, setIsLoading, userDetails } = useUser();

  const classId = userDetails?.class_code;

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3000/teacher/get-attendance/${classId}`
      );

      const data = response.data;

      setAttendanceData(data);
    } catch (error) {
      console.log(
        "Error fetching attendance record: ",
        error.response.data.error
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

  return (
    <div>
      <header>
        <h1>Student Attendance Update</h1>
      </header>

      <div>
        <button onClick={handleAddAttendance}>Add Attendance</button>
      </div>

      {isLoading ? (
        <Loader />
      ) : attendanceData.length < 1 ? (
        <h1>There are no records at this time!</h1>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>S/n</th>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Class Code</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((data, i) => (
                <tr key={data.attendance_id}>
                  <td>{i + 1}</td>
                  <td>{data.student_id}</td>
                  <td>
                    {data.first_name} {data.last_name}
                  </td>
                  <td>{data.class_code}</td>
                  <td>{data.attendance_date}</td>
                  <td className="flex justify-center items-center text-white font-semibold">
                    <span
                      className={`py-1 px-3 rounded-lg ${
                        data.status === "present"
                          ? "bg-emerald-400"
                          : "bg-red-400"
                      }`}
                    >
                      {data.status}
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
            onFetchAttendance={fetchAttendance}
          />
        </div>
      )}

      <Alert
        type="success"
        message={message}
        onClose={handleCloseAlert}
        isVisible={showAlert}
      />
    </div>
  );
}

export default TeacherAttendance;
