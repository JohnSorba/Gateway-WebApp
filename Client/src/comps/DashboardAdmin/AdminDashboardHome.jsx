import { motion } from "framer-motion";
import { PiMoneyFill, PiStudentFill } from "react-icons/pi";
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
          <h1>
            <span>Welcome,</span> Admin
          </h1>
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
              <p>Parents </p>
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
        <section></section>
      </section>
    </motion.div>
  );
};

export default AdminDashboardHome;
