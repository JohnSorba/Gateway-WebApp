/* eslint-disable react/prop-types */
import axios from "axios";
import Loader from "../../../Loader";
import { useUser } from "../../../Contexts/UserContext";
import { useEffect, useState } from "react";

function AttendanceAdd({
  onCloseAttendance,
  onFetchAttendance,
  onShowAlert,
  message,
  onSetMessage,
  onSetType,
}) {
  const { isLoading, setIsLoading, userDetails } = useUser();

  const [students, setStudents] = useState(null);
  const [attendanceDetails, setAttendanceDetails] = useState({
    classId: userDetails.class_code,
    attendanceDate: new Date().toLocaleDateString("en-US", {
      timeZone: "Asia/Kuala_Lumpur",
    }),
    details: [],
  });

  //   console.log("attendance details (in global): ", attendanceDetails);

  const classId = userDetails?.class_code;

  useEffect(() => {
    fetchAttendance();
  }, []);

  // fetch the students from the database based on their class
  const fetchAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:3000/teacher/attendance/students/${classId}`
      );

      const data = response.data;
      //   console.log(data);

      if (data) {
        setStudents(data);

        // Initialize attendaceDetails with student data
        setAttendanceDetails((prevDetails) => ({
          ...prevDetails,
          details: data.map((student) => ({
            studentId: student.student_id,
            attendanceStatus: "",
          })),
        }));
      }
    } catch (error) {
      console.log(
        "Error fetching attendance record: ",
        error.response.data.error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // update the attendance status based on Input
  const handleAttendanceChange = (studentId, newStatus) => {
    // update the attendance details in the state

    setAttendanceDetails((prevDetails) => ({
      ...prevDetails,
      details: prevDetails.details?.map((detail) =>
        detail.studentId === studentId
          ? { ...detail, studentId: studentId, attendanceStatus: newStatus }
          : detail
      ),
    }));
    onSetMessage("");
  };

  // send the attendance data to the server for processing and storing in the database
  const handleAddAttendance = async () => {
    // check if all entries have been made
    const checkEntries = attendanceDetails.details.every(
      (detail) => detail.attendanceStatus !== ""
    );

    if (!checkEntries) {
      onSetMessage("Please complete all entries before submitting!");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3000/teacher/add-attendance",
          { attendanceDetails }
        );

        console.log(response);

        const data = response.data;

        onSetMessage(data.message);
        onSetType(data.type);

        onCloseAttendance();
        onShowAlert(true);
        onFetchAttendance();
      } catch (error) {
        console.log(error.response.data.error);
      }
    }
  };

  return (
    <div className="modal w-[1000px]">
      <header>
        <h2>
          Add New Attendance Record For Today ({new Date().toLocaleDateString()}
          )
        </h2>
      </header>

      <section className="attendance-form">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>S/n</th>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students?.map((data, i) => (
                  <tr key={data.student_id}>
                    <td>{i + 1}</td>
                    <td>{data.student_id}</td>
                    <td>
                      {data.first_name} {data.last_name}
                    </td>
                    <td>
                      <select
                        value={
                          attendanceDetails.details?.find(
                            (d) => d.studentId === data.student_id
                          )?.attendanceStatus || ""
                        }
                        onChange={(e) =>
                          handleAttendanceChange(
                            data.student_id,
                            e.target.value
                          )
                        }
                        className="py-2 px-4 rounded-xl font-semibold"
                      >
                        <option value="">Select</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <footer className="flex items-center justify-between">
              <div>
                {message && (
                  <p className="py-1 px-4 bg-red-700 text-white rounded-xl">
                    {message}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <button onClick={onCloseAttendance}>Close</button>
                <button onClick={handleAddAttendance}>Add</button>
              </div>
            </footer>
          </div>
        )}
      </section>
    </div>
  );
}

export default AttendanceAdd;
