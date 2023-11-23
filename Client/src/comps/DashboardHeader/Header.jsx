/* eslint-disable react/prop-types */
// import { GiHamburgerMenu } from "react-icons/gi";
import "./Header.css";
import { MdNotifications } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "../../Contexts/AuthContext";
import { FaHamburger, FaSearch } from "react-icons/fa";

function Header({ handleClick }) {
  const { authState, logout } = useAuth();

  return (
    <header className="dashboard-header">
      <article className="nav-menu">
        {/* <GiHamburgerMenu className="w-6 h-6 icon" onClick={handleClick} /> */}
        <FaHamburger className="w-6 h-6 icon" onClick={handleClick} />
        <img
          src="/gateway_logo_final.png"
          alt="gateway logo"
          className="border-l-2 pl-4"
        />
      </article>
      <article className="user-actions">
        {" "}
        <div className="search-container">
          <FaSearch className="h-4 w-4 search-icon" />
          <input type="search" className="search-bar" placeholder="Search..." />
        </div>
        <span>
          <MdNotifications className="w-6 h-6 text-red-400" />
        </span>
        <div className="flex gap-2 items-center">
          <img
            src="https://i.pravatar.cc/48?u=118556"
            alt="user-profile"
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-lg">{authState.username}</p>
            {/* <span className="text-sm text-green-700">Active</span> */}
          </div>
        </div>
        <span
          className="flex gap-2 items-center cursor-pointer"
          onClick={logout}
        >
          <BiLogOut className="w-6 h-6 icon" />
          Logout
        </span>
      </article>
    </header>
  );
}

export default Header;
