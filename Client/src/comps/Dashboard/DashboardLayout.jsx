/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import { FaChevronDown, FaHamburger } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { MdNotifications } from "react-icons/md";
import { articles, events, latestNews, notice } from "./DashboardData";
import { Navigation } from "../Navigation";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../Contexts/AuthContext";

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
        <div className="container">
          <section className="profile ">
            <article className="user flex items-center gap-3 px-4 py-2">
              <img src="https://i.pravatar.cc/48?u=118556" alt="user-profile" />
              <p className="flex flex-col gap-0 justify-center">
                <span className="flex items-center gap-4">
                  <span className="text-md">{authState.username}</span>
                  <FaChevronDown className="w-4 h-4 text-gray-400" />
                </span>

                <span className="text-sm text-green-700">Active</span>
              </p>
            </article>
            {/* <NavLink to="/dashboard/pupil/profile" className="nav-link profile">
          <FaUserAlt /> Profile
        </NavLink>
        */}
            <article>
              <MdNotifications className="w-6 h-6 text-red-400" />
            </article>
          </section>
          <section>
            <h3 className="section-heading">Important Notice</h3>
            <ul className="articles">
              {notice.map((item) => (
                <li key={item.title} className="list-item">
                  <img src={item.image} alt="Tech Conference" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>By - {item.author}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="section-heading">Upcoming Events</h3>
            <ul className="events">
              {events.map((item) => (
                <li key={item.title} className="list-item">
                  <img src={item.image} alt="Tech Conference" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.location}</p>
                    {/* <span>{item.date}</span> */}
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="section-heading">Latest News</h3>
            <ul className="latest-news">
              {latestNews.map((item) => (
                <li key={item.title} className="list-item">
                  <img src={item.image} alt="Tech Conference" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.source}</p>
                    <span>{item.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="section-heading">Articles</h3>
            <ul className="articles">
              {articles.map((item) => (
                <li key={item.title} className="list-item">
                  <img src={item.image} alt="Tech Conference" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>By - {item.author}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
};

export default DashboardLayout;
