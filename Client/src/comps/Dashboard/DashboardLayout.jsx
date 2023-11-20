/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import { FaHamburger } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { Navigation } from "../Navigation";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../Contexts/AuthContext";
import NewsSection from "../NewsSection";

const DashboardLayout = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showShadow, setShowShadow] = useState(false);
  const containerRef = useRef(null);

  const { logout, authState } = useAuth();
  const role = authState.role;

  const handleScroll = () => {
    // Logic to add shadow when the scrollable content reaches the sticky header
    const isScrolledToTop = containerRef.current.scrollTop > 0;
    setShowShadow(isScrolledToTop);
  };

  useEffect(() => {
    // Code to run on component mount
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the conponent unmounts
    return () => {
      // Code to run on component unmount
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };
  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="dashboard-container">
      <div className="aside-left ">
        <img
          src="/gateway_logo_final.png"
          alt="school logo"
          className={`logo-img ${isVisible ? "hidden" : ""}`}
        />
        <div className="mt-auto flex flex-col items-center">
          {/* <img src="/3D_dashboard_img.png" alt="3D Pupil" /> */}
          <img src="/boy_standing_sideways_4x5_center.png" alt="3D Pupil" />
          <h3 className="py-4 text-lg font-semibold">Invite A Friend</h3>
          <button className="form-button">Get the App</button>
        </div>
      </div>

      {/* SIDEBAR */}
      <nav
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: "250px",
          height: "100%",
          position: "fixed",
          left: isVisible ? "0" : "-249.9px",
          top: "0",
          transition: "left 0.4s",
          zIndex: "5",
        }}
        className="sidebar"
      >
        <FaHamburger className={`sidebar-menu-icon`} onClick={handleClick} />

        <header className="heading">
          <img src="/gateway_logo_final.png" alt="gateway logo" />
        </header>

        <section className="nav-links">
          {/* Navigation based on user role */}
          <Navigation role={role} />

          <NavLink to="/logout" className="nav-link mt-auto" onClick={logout}>
            <BiLogOutCircle />
            Logout
          </NavLink>
        </section>
      </nav>

      {/* MAIN CONTENT */}
      <main className={`main-content ${isVisible ? "push" : ""}`}>
        <AnimatePresence>
          <Outlet />
        </AnimatePresence>
      </main>

      {/* ASIDE RIGHT CONTENT */}
      <aside
        className={`aside ${showShadow ? "shadow" : ""}`}
        ref={containerRef}
        onScroll={handleScroll}
      >
        <NewsSection />
      </aside>
    </div>
  );
};

export default DashboardLayout;
