import { Routes, Route } from "react-router-dom";

// Dashboard Component Links
import DashboardHome from "../comps/Dashboard/DashboardHome";
import Attendance from "../comps/Dashboard/Attendance";
import Flashcards from "../comps/Dashboard/Flashcards";
import Exams from "../comps/Dashboard/Exams/Exams";
import Reports from "../comps/Dashboard/Reports";
import StudentProfile from "../comps/Dashboard/StudentProfile";
import StudentExamDetails from "../comps/Dashboard/Exams/StudentExamDetails";
import TakeExam from "../comps/Dashboard/Exams/TakeExam";
import StudentTimetable from "../comps/Dashboard/StudentTimetable";

function PupilDashboard() {
  return (
    <>
      {/* <h1>Pupil Dashboard</h1> */}
      <Routes>
        {/* Nested Routes */}
        <Route index element={<DashboardHome />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="exams">
          <Route index element={<Exams />} />
          <Route path="exam-details/:examId" element={<StudentExamDetails />} />
          <Route path="take-exam/:subjectId" element={<TakeExam />} />
        </Route>
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<StudentProfile />} />
      </Routes>
    </>
  );
}

export default PupilDashboard;
