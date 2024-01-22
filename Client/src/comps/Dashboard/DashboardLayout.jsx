/* eslint-disable react/prop-types */
import { Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import { AnimatePresence } from "framer-motion";
import SideNav from "../SideNavigation/SideNav";
import Header from "../DashboardHeader/Header";
import { useState } from "react";
// import { useAuth } from "../../Contexts/AuthContext";

const DashboardLayout = ({ userId }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="dashboard-container">
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
            <div className="width">
              <Outlet />
            </div>
          </AnimatePresence>
        </main>
      </section>
    </div>
  );
};

export default DashboardLayout;
