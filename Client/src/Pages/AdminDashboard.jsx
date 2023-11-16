import { Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";

function AdminDashboard() {
  return (
    <>
      <Routes>
        <Route index element={<AdminDashboardHome />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="support" element={<AdminSupport />} />
      </Routes>
    </>
  );
}

export default AdminDashboard;

// Admin Components
const AdminDashboardHome = () => {
  const pageTransition = {
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "-100%" },
  };

  return (
    <motion.div initial="out" animate="in" exit="out" variants={pageTransition}>
      <div>Admin Dashboard Content</div>
    </motion.div>
  );
};

const UserManagement = () => (
  <motion.div>
    <div>Admin User Management Content</div>
  </motion.div>
);
const AdminReports = () => <div>Admin Reports Content</div>;
const AdminSettings = () => <div>Admin Settings Content</div>;
const AdminSupport = () => <div>Admin Support Content</div>;
