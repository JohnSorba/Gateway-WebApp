import { Route, Routes } from "react-router-dom";
import TeacherProfile from "../comps/DashboardTeacher/TeacherProfile";
import TeacherTimetable from "../comps/DashboardTeacher/TeacherTimetable";
import TeacherAttendance from "../comps/DashboardTeacher/AttendanceRecord/TeacherAttendance";

function TeacherDashboard() {
  return (
    <>
      <Routes>
        <Route index element={<TeacherDashboardHome />} />
        <Route path="timetable" element={<TeacherTimetable />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="grades" element={<TeacherGrades />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="classes" element={<TeacherClasses />} />
      </Routes>
    </>
  );
}

export default TeacherDashboard;

// Teacher Components
const TeacherDashboardHome = () => <div>Teacher Dashboard Content</div>;
const TeacherClasses = () => <div>Classes Content</div>;
const TeacherGrades = () => <div>Grades Content</div>;
