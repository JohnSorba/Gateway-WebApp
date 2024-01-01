/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../Dashboard/DashboardData";
import { FaEye } from "react-icons/fa";

function AttendanceClassView({ view }) {
  const [classAttendance, setClassAttendance] = useState([]);
  const { setIsLoading } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    if (view === "classes") {
      fetchClassAttendance();
    }
  }, [view]);

  const fetchClassAttendance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/attendance/classes-attendance`
      );

      const data = response.data;

      setClassAttendance(data);
    } catch (error) {
      console.log(
        "cannot get student attendance:",
        error.response.data.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const viewClassesAttendanceDetails = (classes) => {
    navigate(`class-details/${classes}`);
  };

  return (
    <div className="table-container h-full overflow-y-scroll">
      <table className="relative">
        <thead className="sticky top-0 left-0 right-0">
          <tr>
            <th>S/n</th>
            <th>Class Code</th>
            <th>Class Name</th>
            <th>(#) Present</th>
            <th>(#) Absent</th>
            <th>(#) Total</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {classAttendance.map((data, i) => (
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
                      viewClassesAttendanceDetails(data.class_code)
                    }
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceClassView;
