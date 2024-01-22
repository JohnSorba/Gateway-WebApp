import { Route, Routes } from "react-router-dom";
import TeacherProfile from "../comps/DashboardTeacher/TeacherProfile";
import TeacherTimetable from "../comps/DashboardTeacher/TeacherTimetable";
import TeacherAttendance from "../comps/DashboardTeacher/AttendanceRecord/TeacherAttendance";
import AttendanceDaily from "../comps/DashboardTeacher/AttendanceRecord/AttendanceDaily";
import StudentDailyAttendance from "../comps/DashboardTeacher/AttendanceRecord/StudentDailyAttendance";
import ReportHome from "../comps/DashboardTeacher/Reports/ReportHome";
import ClassReportDetails from "../comps/DashboardTeacher/Reports/ClassReportDetails";
import StudentReportDetails from "../comps/DashboardTeacher/Reports/StudentReportDetails";
import TeacherExamHome from "../comps/DashboardTeacher/Exams/TeacherExamHome";
import ExamCompleted from "../comps/DashboardTeacher/Exams/ExamCompleted";
import ExamOngoing from "../comps/DashboardTeacher/Exams/ExamOngoing";

function TeacherDashboard() {
  return (
    <>
      <Routes>
        <Route index element={<TeacherDashboardHome />} />
        <Route path="timetable" element={<TeacherTimetable />} />
        <Route path="attendance">
          <Route index element={<TeacherAttendance />} />
          <Route path="date-details/:date" element={<AttendanceDaily />} />
          <Route
            path="student-details/:studentId"
            element={<StudentDailyAttendance />}
          />
        </Route>

        {/* REPORTS ROUTES */}
        <Route path="grades">
          <Route index element={<ReportHome />} />
          <Route path="exam-details/:examId" element={<ClassReportDetails />} />
          <Route
            path="exam-details/:examId/:studentId"
            element={<StudentReportDetails />}
          />
        </Route>

        <Route path="profile" element={<TeacherProfile />} />
        <Route path="exam">
          <Route index element={<TeacherExamHome />} />
          <Route path="ongoing/:examId" element={<ExamOngoing />} />
          <Route path="completed/:examId" element={<ExamCompleted />} />
        </Route>
      </Routes>
    </>
  );
}

export default TeacherDashboard;

// Teacher Components
const TeacherDashboardHome = () => <div>Teacher Dashboard Content</div>;
