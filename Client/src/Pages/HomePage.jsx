import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { BiLogIn, BiLogOut } from "react-icons/bi";

function HomePage() {
  // console.log("student name: ", pupils);
  const { authState, logout } = useAuth();

  return (
    <section className="homepage">
      <header className="header">
        <nav className="navbar container">
          <h1 className="text-3xl font-semibold m-0">
            <img src="/gateway_logo_final.png" alt="gateway logo" />
          </h1>
          <ul className="nav-links">
            {" "}
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
                <Link to="/login">Login</Link>
                <BiLogIn className="w-6 h-6" />
              </li>
            ) : (
              <li>
                <Link to="/login" onClick={logout}>
                  Logout
                </Link>
                <BiLogOut className="w-6 h-6" />
              </li>
            )}
            <li>
              <Link to="/register/step-1">Register</Link>
            </li>
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
          </div>
        </section>
      </header>

      {/* <main>Main</main> */}

      {/* <div className="register"></div> */}
    </section>
  );
}

export default HomePage;
