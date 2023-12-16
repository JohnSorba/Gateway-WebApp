import { Route, Routes } from "react-router-dom";
import TeacherProfile from "../comps/DashboardTeacher/TeacherProfile";
import TeacherTimetable from "../comps/DashboardTeacher/TeacherTimetable";

function TeacherDashboard() {
  return (
    <>
      <Routes>
        <Route index element={<TeacherDashboardHome />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="grades" element={<TeacherGrades />} />
        <Route path="timetable" element={<TeacherTimetable />} />
        <Route path="profile" element={<TeacherProfile />} />
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
