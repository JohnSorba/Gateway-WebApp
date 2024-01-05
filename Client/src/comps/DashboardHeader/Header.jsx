/* eslint-disable react/prop-types */
// import { GiHamburgerMenu } from "react-icons/gi";
import { MdNotifications } from "react-icons/md";
import { BiChevronDown, BiLogOut } from "react-icons/bi";
import { FaHamburger, FaUser } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { useUser } from "../../Contexts/UserContext";
import { GrPrevious } from "react-icons/gr";
import DateTimeDisplay from "../Utilities/DateTimeDisplay";
import "./Header.css";
import Search from "../Search";

function Header({ handleClick }) {
  const { authState, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { userDetails, accountInfo } = useUser();
  const navigate = useNavigate();

  // console.log("details: ", userDetails);
  // console.log("account info: ", accountInfo);

  const prev = () => {
    navigate(-1);
  };

  return (
    <header className="dashboard-header">
      <article className="nav-menu">
        {/* <GiHamburgerMenu className="w-6 h-6 icon" onClick={handleClick} /> */}
        <GrPrevious
          className="w-8 h-8 text-white font-semibold bg-blue-200 rounded-full p-2 cursor-pointer border-r-2 "
          onClick={prev}
        />
        <FaHamburger className="w-6 h-6 pl-4 icon" onClick={handleClick} />
        <img
          src="/gateway_logo_final.png"
          alt="gateway logo"
          className="border-l-2 pl-4"
        />
        <div>
          <DateTimeDisplay />
        </div>
      </article>
      <article className="user-actions">
        {authState.role === "admin" && <Search />}
        <span>
          <MdNotifications className="w-6 h-6 text-red-400" />
        </span>

        {/* Dropdown Profile Info */}
        <div
          className="user-profile dropdown flex gap-2 items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src={userDetails?.profile_photo}
            alt="user-profile-img"
            className="rounded-full"
          />
          <div>
            {/* <p>{userDetails && userDetails.first_name}</p> */}
            <p className="font-semibold text-lg">{authState.username}</p>
            {/* <span className="text-sm text-green-700">Active</span> */}
          </div>
          <BiChevronDown className="w-5 h-5" />
          {isOpen && (
            <div className={`dropdown-content ${isOpen ? "show" : ""}`}>
              <div className="flex flex-col items-center text-center border-b-2 pb-4">
                <img
                  src={userDetails?.profile_photo}
                  alt={`${userDetails.first_name} img`}
                  className="profile-img my-4"
                />

                <p className="text-lg font-semibold">
                  {userDetails.first_name} {userDetails.last_name}
                </p>
                <p>{accountInfo[0].email}</p>
              </div>
              <div className="links">
                <Link
                  to={`/dashboard/${authState.role}/profile`}
                  className="flex gap-4 items-center"
                >
                  <FaUser /> <span>Profile Information</span>
                </Link>
                <span className="flex gap-4 items-center" onClick={logout}>
                  <BiLogOut />
                  <span>Sign Out</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </article>
    </header>
  );
}

export default Header;
