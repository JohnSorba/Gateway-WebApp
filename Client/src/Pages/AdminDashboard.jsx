import { Route, Routes } from "react-router-dom";

import AdminStudents from "../comps/DashboardAdmin/AdminStudents";
import AdminTeachers from "../comps/DashboardAdmin/AdminTeachers";
import AdminExams from "../comps/DashboardAdmin/AdminExams";
import AdminTimetable from "../comps/DashboardAdmin/AdminTimetable";
import AdminReports from "../comps/DashboardAdmin/AdminReports";
import AdminSupport from "../comps/DashboardAdmin/AdminSupport";
import AdminDashboardHome from "../comps/DashboardAdmin/AdminDashboardHome";

function AdminDashboard() {
  return (
    <>
      <Routes>
        <Route index element={<AdminDashboardHome />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="support" element={<AdminSupport />} />
      </Routes>
    </>
  );
}

export default AdminDashboard;

const UserManagement = () => <div>Admin User Management Content</div>;
