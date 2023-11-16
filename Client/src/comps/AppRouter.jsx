import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "../Pages/HomePage";
import ComingSoon from "../Pages/ComingSoon";

import Login from "../Pages/Login";

// Registration Links
import ConfirmDetails from "./RegistrationDetails/ConfirmDetails";
import ProfileInformation from "./RegistrationDetails/ProfileInformation";
import UserAccountInfo from "./RegistrationDetails/UserAccountInfo";
import RegistrationPage from "../Pages/RegistrationPage";
import CourseForm from "./RegistrationDetails/CourseForm";

// Admin and Teacher Dashboards
import AdminDashboard from "../Pages/AdminDashboard";
import TeacherDashboard from "../Pages/TeacherDashboard";
import PupilDashboard from "../Pages/PupilDashboard";

// Other Routes
import PageNotFound from "../Pages/PageNotFound";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "./Dashboard/DashboardLayout";

function AppRouter() {
  const [modalOpen, setModalOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  // const user = { role: "admin" };

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<ComingSoon />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* Registration Route */}
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

        {/* Login Route */}
        <Route
          path="/login"
          element={<Login modalOpen={modalOpen} setModalOpen={setModalOpen} />}
        />

        {/* Logout Route */}
        <Route path="/logout" element={<HomePage />} />

        {/* Dashboard Routes */}
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route
            index
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/*"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="teacher/*"
            element={
              <PrivateRoute requiredRole="teacher">
                <TeacherDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="student/*"
            element={
              <PrivateRoute requiredRole="student">
                <PupilDashboard />
              </PrivateRoute>
            }
          />
        </Route>

        <Route path="*" element={<PageNotFound />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/404" replace />} />

        {/* Admin Dashboard Route */}
        {/* <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <DashboardLayout role="admin">
                <AdminDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        /> */}

        {/* Staff Dashboard Route */}
        {/* <Route
          path="/dashboard/teacher"
          element={
            <PrivateRoute roles={["teacher"]}>
              <DashboardLayout role="teacher">
                <TeacherDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        /> */}

        {/*Pupil Dashboard Routes */}
        {/* <Route
          path="/dashboard/pupil"
          element={
            <PrivateRoute roles={["student"]}>
              <DashboardLayout role="student">
                <PupilDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
