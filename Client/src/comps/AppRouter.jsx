import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../Pages/HomePage";
import ComingSoon from "../Pages/ComingSoon";

import Login from "./Login";

// Registration Links
import ConfirmDetails from "./RegistrationDetails/ConfirmDetails";
import ProfileInformation from "./RegistrationDetails/ProfileInformation";
import UserAccountInfo from "./RegistrationDetails/UserAccountInfo";
import RegistrationPage from "../Pages/RegistrationPage";
import CourseForm from "./RegistrationDetails/CourseForm";

// Dashboard Links
import Dashboard from "./Dashboard/Dashboard";
import DashboardHome from "./Dashboard/DashboardHome";
import Attendance from "./Dashboard/Attendance";
import Timetable from "./Dashboard/Timetable";
import Flashcards from "./Dashboard/Flashcards";
import Exams from "./Dashboard/Exams";
import Reports from "./Dashboard/Reports";
import StudentProfile from "./Dashboard/StudentProfile";

function AppRouter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<ComingSoon />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route
          path="register"
          element={
            <RegistrationPage
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              setAnimate={setAnimate}
            />
          }
        >
          <Route
            path="step-1"
            index
            element={<UserAccountInfo animate={animate} />}
          />
          <Route path="step-2" element={<ProfileInformation />} />
          <Route
            path="step-3"
            element={
              <ConfirmDetails
                setAnimate={setAnimate}
                onModalOpen={setModalOpen}
              />
            }
          />
          <Route path="step-4" element={<CourseForm />} />
        </Route>

        <Route
          path="/login"
          element={<Login modalOpen={modalOpen} setModalOpen={setModalOpen} />}
        />
        <Route path="/logout" element={<HomePage />} />

        {/* Dashboard Routes */}
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="exams" element={<Exams />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
