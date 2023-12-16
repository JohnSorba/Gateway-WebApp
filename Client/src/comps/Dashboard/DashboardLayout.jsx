/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import { AnimatePresence } from "framer-motion";
import SideNav from "../SideNavigation/SideNav";
import Header from "../DashboardHeader/Header";
import { useState } from "react";

const DashboardLayout = ({ userId }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = () => {
    setIsVisible(!isVisible);
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
        </main>
      </section>
    </div>
  );
};

export default DashboardLayout;
