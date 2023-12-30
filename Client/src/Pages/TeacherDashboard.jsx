import { Route, Routes } from "react-router-dom";
import TeacherProfile from "../comps/DashboardTeacher/TeacherProfile";
import TeacherTimetable from "../comps/DashboardTeacher/TeacherTimetable";
import TeacherAttendance from "../comps/DashboardTeacher/AttendanceRecord/TeacherAttendance";
import AttendanceDaily from "../comps/DashboardTeacher/AttendanceRecord/AttendanceDaily";
import StudentDailyAttendance from "../comps/DashboardTeacher/AttendanceRecord/StudentDailyAttendance";

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
