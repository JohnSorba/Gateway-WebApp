import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import "./Home.css";
// import { useEffect, useState } from "react";

// import axios from "axios";

function HomePage() {
  // console.log("student name: ", pupils);
  const { authState, logout } = useAuth();
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   const getPrivateAdminRoute = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/admin");

  //       const data = await response.data;
  //       console.log(response);

  //       setMessage(data);
  //     } catch (err) {
  //       console.error("Error fetching route", err);
  //     }
  //   };

  //   getPrivateAdminRoute();
  // }, []);

  return (
    <section className="homepage">
      <header className="home-header">
        <nav className="navbar container">
          <h1 className="text-3xl font-semibold m-0">
            <img src="/gateway_logo_final.png" alt="gateway logo" />
          </h1>
          <ul className="nav-links">
            {" "}
            <li>
              <Link to="/home">Learn More</Link>
            </li>
            {/* Links to Dashboards based on role */}
            {authState.role === "student" && (
              <li>
                <Link to="/dashboard/student">Dashboard</Link>
              </li>
            )}
            {authState.role === "admin" && (
              <li>
                <Link to="/dashboard/admin">Dashboard</Link>
              </li>
            )}
            {authState.role === "teacher" && (
              <li>
                <Link to="/dashboard/teacher">Dashboard</Link>
              </li>
            )}
            {/* Home Login/Logout Links */}
            {!authState.token ? (
              <li>
                <Link to="/login">
                  Login
                  <BiLogIn className="w-5 h-5" />
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/login" onClick={logout}>
                  Logout
                  <BiLogOut className="w-5 h-5" />
                </Link>
              </li>
            )}
            {/* <li>
              <Link to="/admin/register/step-1">Register</Link>
            </li> */}
            <button className="font-bold uppercase">Get App</button>
          </ul>
        </nav>
        <section className="hero-section container">
          <h1 className="text-9xl font-bold text-slate-800 m-0 flex flex-col">
            Gateway <span className="text-8xl text-yellow-400">Connect</span>
          </h1>
          <p>Welcome to Gateway Pre-School Student Portal</p>
          <div className="flex gap-4">
            <Link to="/login" className="form-button">
              Login
            </Link>
            <Link to="/" className="form-button">
              Back to Flash Screen
            </Link>
            {/* {message} */}
          </div>
        </section>
      </header>

      {/* <main>Main</main> */}
    </section>
  );
}

export default HomePage;
