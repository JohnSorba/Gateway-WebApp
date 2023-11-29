import { Route, Routes } from "react-router-dom";

import AdminStudents from "../comps/DashboardAdmin/AdminStudents";
import AdminTeachers from "../comps/DashboardAdmin/AdminTeachers";
import AdminExams from "../comps/DashboardAdmin/AdminExams";
import AdminTimetable from "../comps/DashboardAdmin/Timetable/AdminTimetable";
import AdminReports from "../comps/DashboardAdmin/AdminReports";
import AdminDashboardHome from "../comps/DashboardAdmin/AdminDashboardHome";
import AdminEvents from "../comps/DashboardAdmin/AdminEvents";
import ExamDetails from "../comps/DashboardAdmin/Exams/ExamDetails";
import Questions from "../comps/DashboardAdmin/Exams/Questions";

function AdminDashboard() {
  return (
    <>
      <Routes>
        <Route index element={<AdminDashboardHome />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="exams" element={<AdminExams />}>
          <Route path={`exam-details/examId`} element={<ExamDetails />} />
          <Route path={`exam-subjects/examId`} />
        </Route>
        <Route path="questions" element={<Questions />} />

        <Route path="reports" element={<AdminReports />} />

        <Route path="events" element={<AdminEvents />} />
      </Routes>
    </>
  );
}

export default AdminDashboard;
