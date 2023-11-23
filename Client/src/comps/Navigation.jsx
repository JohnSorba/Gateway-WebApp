import { CgTranscript } from "react-icons/cg";
import {
  FaChalkboardTeacher,
  FaTable,
  FaUserCheck,
  FaUserPlus,
} from "react-icons/fa";
import { MdDashboard, MdEventNote } from "react-icons/md";
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
      title: "Reports",
      link: "/dashboard/admin/reports",
      icon: <CgTranscript />,
    },
    {
      title: "Events",
      link: "/dashboard/admin/events",
      icon: <MdEventNote />,
    },
    {
      title: "Account Registration",
      link: "/admin/register/step-1",
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
      title: "Classes",
      link: "/dashboard/teacher/classes",
      icon: <FaUserCheck />,
    },
    {
      title: "Assignments",
      link: "/dashboard/teacher/assignments",
      icon: <FaTable />,
    },
    {
      title: "Grades",
      link: "/dashboard/teacher/grades",
      icon: <PiCardsFill />,
    },
    {
      title: "Calendar",
      link: "/dashboard/teacher/calendar",
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
      link: "/dashboard/student/flashcards",
      icon: <PiCardsFill />,
      title: "Study Flashcards",
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
