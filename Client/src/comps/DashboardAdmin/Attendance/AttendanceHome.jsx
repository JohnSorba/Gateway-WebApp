/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useUser } from "../../../Contexts/UserContext";
import axios from "axios";
import Loader from "../../../Loader";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { localDateString, baseURL } from "../../Dashboard/DashboardData";
import AttendanceClassView from "./AttendanceClassView";
import BarChartBox from "../../Charts/Barchart/BarChartBox";
import LineChartBox from "../../Charts/LineChart/LineChartBox";
import { useSearch } from "../../../Contexts/SearchContext";

export default function AttendanceHome() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [view, setView] = useState("date");
  const { isLoading, setIsLoading } = useUser();

  const navigate = useNavigate();

  // console.log(chartData && typeof chartData[0]?.totalpresent);

  useEffect(() => {
    fetchChartData();

    switch (view) {
      case "date":
        fetchDateAttendance();
        break;
      case "student":
        fetchStudentsAttendance();
        break;
      default:
        "classes";
    }
  }, [view]);

  const fetchChartData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/attendance/get-chart`);

      const data = response.data;

      setChartData(data);
    } catch (error) {
      console.log(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDateAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseURL}/attendance/date-attendance`);

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
        `${baseURL}/attendance/students-attendance`
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

  const viewAttendanceDetails = (date) => {
    navigate(`date-classes-details/${date}`);
  };

  const viewStudentAttendanceDetails = (studentId) => {
    2;
    navigate(`student-details/${studentId}`);
  };

  return (
    <div>
      <header>
        <h1>School Attendance Report</h1>
        {/* <p>Overall Attendance: 9</p>
        <p>Absent: 3</p>
        <p>Present: 6</p> */}

        <div className="grid grid-cols-2 gap-8 h-[350px] mb-8">
          <BarChartBox data={chartData} />
          <LineChartBox data={chartData} />
        </div>

        <div className="grid grid-cols-[250px_250px_1fr_200px] gap-4 items-start">
          <div className="flex gap-4 items-start">
            <p>Filter by:</p>
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="form-select"
            >
              <option value="date">Date View</option>
              <option value="classes">Class View</option>
              <option value="student">Student View</option>
            </select>
          </div>

          <div></div>
          <h2>Attendance Summary</h2>
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
                <tr key={i} className="py-1">
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
      ) : view === "student" ? (
        <AttendanceStudentView
          studentAttendance={studentAttendance}
          onViewStudentDetails={viewStudentAttendanceDetails}
        />
      ) : view === "classes" ? (
        <AttendanceClassView view={view} />
      ) : (
        <div>Cannot display data at this moment!</div>
      )}
    </div>
  );
}

export function AttendanceStudentView({
  studentAttendance,
  onViewStudentDetails,
}) {
  const { searchQuery } = useSearch();
  return (
    <div className="table-container h-[450px] overflow-y-scroll">
      <table className="relative">
        <thead className="sticky top-0 left-0 right-0">
          <tr>
            <th>S/n</th>
            <th>Full Name</th>
            <th>Class</th>
            <th>(#) Present</th>
            <th>(#) Absent</th>
            <th>(#) Total</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {studentAttendance
            .filter((data) =>
              data.first_name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((data, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  {data.first_name} {data.last_name}
                </td>
                <td>{data.class_name}</td>
                <td>{data.totalpresent}</td>
                <td>{data.totalabsent}</td>
                <td>{data.totalstatus}</td>
                <td className="flex justify-center items-center text-white font-semibold">
                  <span className=" cursor-pointer">
                    <FaEye
                      className="h-7 w-7 text-blue-500 hover:text-blue-700"
                      onClick={() => onViewStudentDetails(data.student_id)}
                    />
                  </span>
                </td>
                {!data.first_name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) && (
                  <p>No rows matches your query!</p>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
