import { motion } from "framer-motion";
import { PiMoneyFill, PiStudentFill } from "react-icons/pi";
import { studentData, events } from "../Dashboard/DashboardData";
import "./DashboardAdmin.css";
import PieChartBox from "../Charts/PieChart/PieChartBox";
// Admin Components
const AdminDashboardHome = () => {
  const pageTransition = {
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "-100%" },
  };

  return (
    <motion.div initial="out" animate="in" exit="out" variants={pageTransition}>
      <section className="admin-home">
        {/* HEADER */}
        <header className="header">
          <h1>Dashboard</h1>
          <p>Hi, Welcome to your Dashboard Admin</p>
        </header>
        {/* STATS */}
        <section className="stats">
          <article>
            <PiStudentFill className="h-12 w-12 icon" />
            <div>
              <span>31</span>
              <p>Students </p>
            </div>
          </article>
          <article>
            <PiStudentFill className="h-12 w-12 icon" />
            <div>
              <span>9</span>
              <p>Teachers </p>
            </div>
          </article>
          <article>
            <PiStudentFill className="h-12 w-12 icon" />
            <div>
              <span>9</span>
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
                  <th>Student Name</th>
                  <th>Parent Name</th>
                  <th>Phone</th>
                  <th>Class</th>
                  <th>Grade</th>
                  <th>Fee Status</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((data) => (
                  <tr key={data.phone}>
                    <td>{data.fullName}</td>
                    <td>{data.parentName}</td>
                    <td>{data.phone}</td>
                    <td>{data.class}</td>
                    <td>{data.grade}</td>
                    <td style={{ color: "red" }}>{data.feeStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <section className="w-2/6 ">
            <PieChartBox />
          </section>
        </section>{" "}
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
    </motion.div>
  );
};

export default AdminDashboardHome;
