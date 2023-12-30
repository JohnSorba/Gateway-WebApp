import { CgTranscript } from "react-icons/cg";
import {
  FaCalendarPlus,
  FaChalkboardTeacher,
  FaTable,
  FaUserCheck,
  FaUserPlus,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { PiCardsFill, PiExamFill, PiStudentFill } from "react-icons/pi";
import { NavLink } from "react-router-dom";

/* eslint-disable react/prop-types */
export function Navigation({ role }) {
  if (role === "admin") {
    return <AdminNav />;
  } else if (role === "teacher") {
    return <TeacherNav />;
  } else if (role === "student") {
    return <StudentNav />;
  }
}

// Admin Navigation
export function AdminNav() {
  const adminNavLinks = [
    {
      title: "Overview",
      link: "/dashboard/admin",
      icon: <MdDashboard />,
    },
    {
      title: "Students",
      link: "/dashboard/admin/students",
      icon: <PiStudentFill />,
    },
    {
      title: "Teachers",
      link: "/dashboard/admin/teachers",
      icon: <FaChalkboardTeacher />,
    },
    {
      link: "/dashboard/admin/attendance",
      icon: <CgTranscript />,
      title: "Attendance",
    },
    {
      link: "/dashboard/admin/timetable",
      icon: <FaTable />,
      title: "Timetable",
    },
    {
      link: "/dashboard/admin/exams",
      icon: <PiExamFill />,
      title: "Exams",
    },
    {
      link: "/dashboard/admin/questions",
      icon: <PiExamFill />,
      title: "Exam Questions",
    },
    {
      title: "Reports",
      link: "/dashboard/admin/reports",
      icon: <CgTranscript />,
    },
    {
      title: "User Accounts",
      link: "/dashboard/admin/users",
      icon: <FaUserPlus />,
    },
  ];

  return (
    <>
      {adminNavLinks.map((link) => (
        <NavLink
          key={link.link}
          to={link.link}
          end // allows the active property to not be set to the index link
          className="nav-link"
        >
          {link.icon}
          {link.title}
        </NavLink>
      ))}
    </>
  );
}

// Teacher Navigation
export function TeacherNav() {
  const teacherNavLinks = [
    {
      title: "Dashboard",
      link: "/dashboard/teacher",
      icon: <MdDashboard />,
    },
    {
      title: "Timetable",
      link: "/dashboard/teacher/timetable",
      icon: <PiExamFill />,
    },
    {
      title: "Attendance",
      link: "/dashboard/teacher/attendance",
      icon: <FaCalendarPlus />,
    },
    {
      title: "Exams*",
      link: "/dashboard/teacher/exam",
      icon: <FaTable />,
    },
    {
      title: "Grades",
      link: "/dashboard/teacher/grades",
      icon: <PiCardsFill />,
    },
    {
      title: "Profile",
      link: "/dashboard/teacher/profile",
      icon: <PiExamFill />,
    },
  ];

  return (
    <>
      {teacherNavLinks.map((link) => (
        <NavLink
          key={link.link}
          to={link.link}
          end // allows the active property to not be set to the index link
          className="nav-link"
        >
          {link.icon}
          {link.title}
        </NavLink>
      ))}
    </>
  );
}

// Student Navigation
export function StudentNav() {
  const studentLinks = [
    {
      link: "/dashboard/student",
      icon: <MdDashboard />,
      title: "Dashboard",
    },
    {
      link: "/dashboard/student/attendance",
      icon: <FaUserCheck />,
      title: "Attendance",
    },
    {
      link: "/dashboard/student/timetable",
      icon: <FaTable />,
      title: "Timetable",
    },

    {
      link: "/dashboard/student/exams",
      icon: <PiExamFill />,
      title: "Exams",
    },
    {
      link: "/dashboard/student/reports",
      icon: <CgTranscript />,
      title: "Report Cards",
    },
  ];

  return (
    <>
      {studentLinks.map((link) => (
        <NavLink
          key={link.link}
          to={link.link}
          end // allows the active property to not be set to the index link
          className="nav-link"
        >
          {link.icon}
          {link.title}
        </NavLink>
      ))}
    </>
  );
}
