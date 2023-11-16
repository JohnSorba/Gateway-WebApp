import { Route, Routes } from "react-router-dom";

function TeacherDashboard() {
  return (
    <>
      <Routes>
        <Route index element={<TeacherDashboardHome />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="grades" element={<TeacherGrades />} />
        <Route path="calendar" element={<TeacherCalendar />} />
      </Routes>
    </>
  );
}

export default TeacherDashboard;

// Teacher Components
const TeacherDashboardHome = () => <div>Teacher Dashboard Content</div>;
const TeacherClasses = () => <div>Classes Content</div>;
const TeacherAssignments = () => <div>Assignments Content</div>;
const TeacherGrades = () => <div>Grades Content</div>;
const TeacherCalendar = () => <div>Calendar Content</div>;
