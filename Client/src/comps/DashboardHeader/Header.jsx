/* eslint-disable react/prop-types */
// import { GiHamburgerMenu } from "react-icons/gi";
import "./Header.css";
import { MdNotifications } from "react-icons/md";
import { BiChevronDown, BiLogOut } from "react-icons/bi";
import { FaHamburger, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useUser } from "../../Contexts/UserContext";

function Header({ handleClick }) {
  const { authState, logout } = useAuth();
  // const [userDetails, setUserDetails] = useState(null);
  // const [userToken, setUserToken] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  // const [userToken, setUserToken] = useState(authState.token);
  const { token, userDetails, setUserDetails, makeAuthenticatedRequest } =
    useUser();

  // console.log("details: ", userDetails);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Make an authenticated request to the endpoint that uses the middleware
        const response = await makeAuthenticatedRequest(
          "http://localhost:3000/student/user/details",
          token
        );

        // console.log(response);

        // console.log(response.user);
        // console.log(response.user.userDetails);

        setUserDetails(response.user.userDetails);
      } catch (error) {
        // Handle errors, e.g., redirect to the login page
        console.error("Error fetching user details", error.response.data.error);
      }
    };

    // console.log(fetchUserDetails);
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
        <div className="search-container">
          <FaSearch className="h-4 w-4 search-icon" />
          <input type="search" className="search-bar" placeholder="Search..." />
        </div>
        <span>
          <MdNotifications className="w-6 h-6 text-red-400" />
        </span>

        {/* Dropdown Profile Info */}
        <div
          className="user-profile flex gap-2 items-center"
          onClick={() => handleToggleDropdown}
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
          <BiChevronDown className="w-4 h-4" />

          <div
            className={`dropdown-item ${showDropdown === true ? "show" : ""}`}
          >
            <p>Profile Information</p>
            <span
              className="flex gap-2 items-center cursor-pointer"
              onClick={logout}
            >
              <BiLogOut className="w-6 h-6 icon" />
              Logout
            </span>
          </div>
        </div>
      </article>
    </header>
  );
}

export default Header;
