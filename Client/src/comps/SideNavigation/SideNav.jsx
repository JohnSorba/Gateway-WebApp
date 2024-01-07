import { useAuth } from "../../Contexts/AuthContext";
import { NavLink } from "react-router-dom";

import { BiLogOutCircle } from "react-icons/bi";
import { Navigation } from "../Navigation";
import "./SideNav.css";

// eslint-disable-next-line react/prop-types
function SideNav({ isVisible }) {
  const { logout, authState } = useAuth();
  const role = authState.role;

  return (
    <nav className={`sidebar ${isVisible ? "" : "slide-in"}`}>
      <section
        className={`nav-links   ${
          authState.role === "admin"
            ? "admin"
            : authState.role === "teacher"
            ? "teacher"
            : "student"
        }`}
      >
        {/* Navigation based on user role */}
        <Navigation role={role} />

        <NavLink to="/logout" className={`nav-link mt-auto`} onClick={logout}>
          <BiLogOutCircle />
          Logout
        </NavLink>
      </section>
    </nav>
  );
}

export default SideNav;
