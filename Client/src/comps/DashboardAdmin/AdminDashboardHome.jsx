import { motion } from "framer-motion";
import { PiMoneyFill, PiStudentFill } from "react-icons/pi";
import Loader from "../../Loader";
import { events, calculateGrade } from "../Dashboard/DashboardData";
import "./DashboardAdmin.css";
import PieChartBox from "../Charts/PieChart/PieChartBox";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../Contexts/UserContext";
import { Link } from "react-router-dom";
// Admin Components
const AdminDashboardHome = () => {
  const [stats, setStats] = useState(null);
  const { isLoading, setIsLoading } = useUser();
  const pageTransition = {
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "-100%" },
  };

  const genderData = stats?.genderCountData;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:3000/admin/dashboard-stats"
        );

        const data = response.data;

        setStats(data);
      } catch (error) {
        console.log("Error fetching stats", error.response.data.error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [setIsLoading]);

  return (
    <motion.div initial="out" animate="in" exit="out" variants={pageTransition}>
      {isLoading ? (
        <Loader />
      ) : (
        <section className="admin-home">
          {/* HEADER */}
          <header className="header">
            <article>
              <h2 className="text-left">Hi, Admin </h2>
              <p>Welcome to your Dashboard!</p>
            </article>

            <article>
              <h2 className="text-right my-2">Quick Links</h2>
              <div className="flex gap-4">
                <Link to="/dashboard/admin/exams">Schedule Exam</Link>
                <p>|</p>
                <Link to="/dashboard/admin/users">View Account Info</Link>
                <p>|</p>
                <Link to="/dashboard/admin/reports">View Reports</Link>
              </div>
            </article>
          </header>
          {/* STATS */}
          <section className="stats">
            <article>
              <PiStudentFill className="h-12 w-12 icon" />
              <div>
                <span>{stats && stats.studentCount}</span>
                <p>Students </p>
              </div>
            </article>
            <article>
              <PiStudentFill className="h-12 w-12 icon" />
              <div>
                <span>{stats && stats.teacherCount}</span>
                <p>Teachers </p>
              </div>
            </article>
            <article>
              <PiStudentFill className="h-12 w-12 icon" />
              <div>
                <span>{stats && stats.attendanceCount}</span>
                <p>attendance </p>
              </div>
            </article>
            <article>
              <PiMoneyFill className="h-12 w-12 icon" />
              <div>
                <span>RM 1.5k</span>
                <p>Earnings</p>
              </div>
            </article>
          </section>
          {/* OTHER */}
          <section className="class-details">
            <article className="top-students">
              <h3 className="mb-4 text-lg font-semibold">Students Overview</h3>
              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th className="text-left">Student Name</th>
                    <th className="text-left">Parent Name</th>
                    <th className="text-left">Phone</th>
                    <th>Class</th>
                    <th>Mark</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {stats &&
                    stats.studentData &&
                    stats.studentData.map((data, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="text-left">
                          <span>{data.first_name}</span>{" "}
                          <span>{data.last_name}</span>
                        </td>
                        <td className="text-left">{data.parent_name}</td>
                        <td className="text-left">{data.parent_contact}</td>
                        <td>{data.class_code}</td>

                        <td
                          className={`${
                            data.avg ? "text-green-500" : "text-red-600"
                          }`}
                        >
                          {Number(data.avg).toFixed(0) || "n.a."}%
                        </td>

                        <td className="font-semibold">
                          {calculateGrade(data.avg && data.avg)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </article>

            <section className="w-2/6 ">
              <PieChartBox genderCountData={genderData} />
            </section>
          </section>{" "}
          {/* Teacher Details*/}
          <section className="class-details">
            <article className="top-students">
              <h3 className="mb-4 text-lg font-semibold">Teachers Overview</h3>
              <table>
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>Teacher ID</th>
                    <th>Teacher Name</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Class</th>
                  </tr>
                </thead>
                <tbody>
                  {stats &&
                    stats.teacherData &&
                    stats.teacherData.map((data, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{data.teacher_id}</td>
                        <td>
                          <span>{data.first_name}</span>{" "}
                          <span>{data.last_name}</span>
                        </td>
                        <td>{`${data.gender === "Male" ? "🧑🏽‍💼 " : "🙍🏽‍♀️ "}${
                          data.gender
                        }`}</td>
                        <td>{data.phone_number}</td>
                        <td>{data.class_code}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </article>
            {/* Upcoming Events */}
            <article className="admin-events-section">
              <h3 className="section-heading text-lg font-semibold mb-4">
                Upcoming Events
              </h3>
              <div className="admin-aside">
                <ul className="events">
                  {events.map((item) => (
                    <li key={item.title} className="list-item">
                      <img src={item.image} alt="No Img" />
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.location}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </section>
        </section>
      )}
    </motion.div>
  );
};

export default AdminDashboardHome;
