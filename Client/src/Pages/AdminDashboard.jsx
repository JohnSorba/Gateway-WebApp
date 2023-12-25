import { Route, Routes } from "react-router-dom";

import AdminStudents from "../comps/DashboardAdmin/AdminStudents";
import AdminTeachers from "../comps/DashboardAdmin/AdminTeachers";
import AdminExams from "../comps/DashboardAdmin/Exams/AdminExams";
import AdminTimetable from "../comps/DashboardAdmin/Timetable/AdminTimetable";
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

function AdminDashboard() {
  return (
    <>
      <Routes>
        <Route index element={<AdminDashboardHome />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="timetable" element={<AdminTimetable />} />

        {/* EXAMS ROUTES */}
        <Route path="exams">
          <Route index element={<AdminExams />} />
          <Route path="exam-list" element={<ExamList />} />
          <Route path="exam-details/:examId" element={<ExamDetails />} />
          <Route path="exam-subjects/:examId" />
        </Route>

        {/* QUESTIONS ROUTES */}
        <Route path="questions">
          <Route index element={<Questions />} />
          <Route path="add" element={<QuestionsAdd />} />
          <Route path="details/:questionId" element={<QuestionDetails />} />
        </Route>

        <Route path="reports">
          <Route index element={<AdminReports />} />
          <Route path="exam-details/:examId" element={<ReportExamDetails />} />
          <Route
            path="exam-details/:examId/:studentId"
            element={<ReportStudentDetails />}
          />
        </Route>

        <Route path="users" element={<UserAccounts />} />
      </Routes>
    </>
  );
}

export default AdminDashboard;
