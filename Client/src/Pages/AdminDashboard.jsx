import { Route, Routes } from "react-router-dom";

import AdminStudents from "../comps/DashboardAdmin/AdminStudents/AdminStudents";
import AdminTeachers from "../comps/DashboardAdmin/AdminTeachers/AdminTeachers";
import AdminExams from "../comps/DashboardAdmin/Exams/AdminExams";
import AdminTimetable from "../comps/DashboardAdmin/Timetable/AdminTimetable";
import AttendanceHome from "../comps/DashboardAdmin/Attendance/AttendanceHome";
import AdminReports from "../comps/DashboardAdmin/Reports/AdminReports";
import AdminDashboardHome from "../comps/DashboardAdmin/AdminDashboardHome";
import ExamDetails from "../comps/DashboardAdmin/Exams/ExamDetails";
import Questions from "../comps/DashboardAdmin/Exams/Questions";
import QuestionsAdd from "../comps/DashboardAdmin/Exams/QuestionsAdd";
import ExamList from "../comps/DashboardAdmin/Exams/ExamList";
import QuestionDetails from "../comps/DashboardAdmin/Exams/QuestionDetails";
import ReportExamDetails from "../comps/DashboardAdmin/Reports/ReportExamDetails";
import ReportStudentDetails from "../comps/DashboardAdmin/Reports/ReportStudentDetails";
import UserAccounts from "../comps/DashboardAdmin/UserAccounts";
import AdminStudentDetails from "../comps/DashboardAdmin/AdminStudents/AdminStudentDetails";
import AdminTeacherDetails from "../comps/DashboardAdmin/AdminTeachers/AdminTeacherDetails";
import ClassesDailyAttendance from "../comps/DashboardAdmin/Attendance/ClassesDailyAttendance";
import ClassDailyAttendance from "../comps/DashboardAdmin/Attendance/ClassDailyAttendance";
import ClassAttendanceDetails from "../comps/DashboardAdmin/Attendance/ClassAttendanceDetails";
import StudentAttendanceDetails from "../comps/DashboardAdmin/Attendance/StudentAttendanceDetails";

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
          <Route path="exam-list" element={<ExamList />} />
          <Route
            path="exam-list/exam-details/:examId"
            element={<ExamDetails />}
          />
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
