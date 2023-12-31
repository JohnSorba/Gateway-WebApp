import { Route, Routes } from "react-router-dom";
// ADMIN DASHBOARD HOME ROUTES
import AdminDashboardHome from "../comps/DashboardAdmin/AdminDashboardHome";

// PROFILE ROUTES
import AdminStudents from "../comps/DashboardAdmin/AdminStudents/AdminStudents";
import AdminTeachers from "../comps/DashboardAdmin/AdminTeachers/AdminTeachers";
import AdminStudentDetails from "../comps/DashboardAdmin/AdminStudents/AdminStudentDetails";
import AdminTeacherDetails from "../comps/DashboardAdmin/AdminTeachers/AdminTeacherDetails";
import UserAccounts from "../comps/DashboardAdmin/UserAccounts";

// EXAM ROUTES
import AdminExams from "../comps/DashboardAdmin/Exams/AdminExams";
import ExamList from "../comps/DashboardAdmin/Exams/ExamList";
import ExamDetails from "../comps/DashboardAdmin/Exams/ExamDetails";
import ExamOngoing from "../comps/DashboardAdmin/Exams/ExamOngoing";
import ExamCompleted from "../comps/DashboardAdmin/Exams/ExamCompleted";
import Instructions from "../comps/DashboardAdmin/Exams/Instructions";
import Questions from "../comps/DashboardAdmin/Exams/Questions";
import QuestionsAdd from "../comps/DashboardAdmin/Exams/QuestionsAdd";
import QuestionDetails from "../comps/DashboardAdmin/Exams/QuestionDetails";

// TIMETABLE ROUTES
import AdminTimetable from "../comps/DashboardAdmin/Timetable/AdminTimetable";

// ATTENDANCE ROUTES
import AttendanceHome from "../comps/DashboardAdmin/Attendance/AttendanceHome";
import ClassesDailyAttendance from "../comps/DashboardAdmin/Attendance/ClassesDailyAttendance";
import ClassDailyAttendance from "../comps/DashboardAdmin/Attendance/ClassDailyAttendance";
import ClassAttendanceDetails from "../comps/DashboardAdmin/Attendance/ClassAttendanceDetails";
import StudentAttendanceDetails from "../comps/DashboardAdmin/Attendance/StudentAttendanceDetails";

// REPORTS ROUTES
import AdminReports from "../comps/DashboardAdmin/Reports/AdminReports";
import ReportExamDetails from "../comps/DashboardAdmin/Reports/ReportExamDetails";
import ReportStudentDetails from "../comps/DashboardAdmin/Reports/ReportStudentDetails";

function AdminDashboard() {
  return (
    <>
      <Routes>
        <Route index element={<AdminDashboardHome />} />

        {/* STUDENT ROUTES */}
        <Route path="students">
          <Route index element={<AdminStudents />} />
          <Route path="details/:studentId" element={<AdminStudentDetails />} />
        </Route>

        {/* TEACHER ROUTES */}
        <Route path="teachers">
          <Route index element={<AdminTeachers />} />
          <Route path="details/:teacherId" element={<AdminTeacherDetails />} />
        </Route>

        {/* ATTENDANCE ROUTES */}
        <Route path="attendance">
          <Route index element={<AttendanceHome />} />
          <Route
            path="date-classes-details/:date"
            element={<ClassesDailyAttendance />}
          />
          <Route
            path="date-classes-details/:date/:classId"
            element={<ClassDailyAttendance />}
          />
          <Route
            path="class-details/:classId"
            element={<ClassAttendanceDetails />}
          />
          <Route
            path="student-details/:studentId"
            element={<StudentAttendanceDetails />}
          />
        </Route>

        {/* TIMETABLE ROUTES */}
        <Route path="timetable" element={<AdminTimetable />} />

        {/* EXAMS ROUTES */}
        <Route path="exams">
          <Route index element={<AdminExams />} />
          <Route path="exam-list">
            <Route index element={<ExamList />} />
            <Route path="draft/:examId" element={<ExamDetails />} />
            <Route path="ongoing/:examId" element={<ExamOngoing />} />
            <Route path="completed/:examId" element={<ExamCompleted />} />
          </Route>
          <Route path="instructions" element={<Instructions />} />
          <Route path="exam-subjects/:examId" />
        </Route>

        {/* QUESTIONS ROUTES */}
        <Route path="questions">
          <Route index element={<Questions />} />
          <Route path="add" element={<QuestionsAdd />} />
          <Route path="details/:questionId" element={<QuestionDetails />} />
        </Route>

        {/* REPORTS ROUTES */}
        <Route path="reports">
          <Route index element={<AdminReports />} />
          <Route path="exam-details/:examId" element={<ReportExamDetails />} />
          <Route
            path="exam-details/:examId/:studentId"
            element={<ReportStudentDetails />}
          />
        </Route>

        {/* USER ACCOUNTS */}
        <Route path="users" element={<UserAccounts />} />
      </Routes>
    </>
  );
}

export default AdminDashboard;
