/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import { AnimatePresence } from "framer-motion";
import SideNav from "../SideNavigation/SideNav";
import Header from "../DashboardHeader/Header";
import Alert from "../../comps/Utilities/Alert";
import { useState } from "react";
// import { useAuth } from "../../Contexts/AuthContext";

const DashboardLayout = ({ userId }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  // const { authState, isAuthChecked } = useAuth();
  // const token = authState.token;

  // console.log(token);

  // useEffect(() => {
  //   setShowAlert(true);
  //   const timer = setTimeout(() => {
  //     if (isAuthChecked) {
  //       setShowAlert(false);
  //     }
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [isAuthChecked]);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="dashboard-container">
      {/* <div className="aside-left ">
        <img
          src="/gateway_logo_final.png"
          alt="school logo"
          className="logo-img"
        />
        <div className="mt-auto flex flex-col items-center">
          <img src="/3D_dashboard_img.png" alt="3D Pupil" />
          <h3 className="py-4 text-lg font-semibold">Invite A Friend</h3>
          <button className="form-button">Get the App</button>
        </div>
      </div> */}

      <Header handleClick={handleClick} userId={userId} />
      <section className="main-section">
        {/* SIDE NAV - Slides In From Left */}
        <SideNav
          handleClick={handleClick}
          setIsVisible={setIsVisible}
          isVisible={isVisible}
        />

        {/* MAIN CONTENT */}
        <main className="main-content">
          <AnimatePresence>
            <Outlet />
          </AnimatePresence>

          {/* TO GO OVER */}
          <Alert
            type="success"
            message="Login Successful!"
            onClose={handleCloseAlert}
            isVisible={showAlert}
          />
        </main>
      </section>
    </div>
  );
};

export default DashboardLayout;
