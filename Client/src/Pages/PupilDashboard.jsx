import { Routes, Route } from "react-router-dom";

// Dashboard Component Links
import DashboardHome from "../comps/Dashboard/DashboardHome";
import Attendance from "../comps/Dashboard/Attendance";
import Timetable from "../comps/Dashboard/Timetable";
import Flashcards from "../comps/Dashboard/Flashcards";
import Exams from "../comps/Dashboard/Exams";
import Reports from "../comps/Dashboard/Reports";
import StudentProfile from "../comps/Dashboard/StudentProfile";

function PupilDashboard() {
  return (
    <>
      {/* <h1>Pupil Dashboard</h1> */}
      <Routes>
        {/* Nested Routes */}
        <Route index element={<DashboardHome />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="exams" element={<Exams />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<StudentProfile />} />
      </Routes>
    </>
  );
}

export default PupilDashboard;
