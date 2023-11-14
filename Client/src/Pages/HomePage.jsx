import { Link } from "react-router-dom";

function HomePage() {
  // console.log("student name: ", pupils);

  return (
    <section className="homepage">
      <header className="header">
        <nav className="navbar container">
          <h1 className="text-3xl font-semibold m-0">
            <img src="/gateway_logo_final.png" alt="gateway logo" />
          </h1>
          <ul className="nav-links">
            <li>
              <Link to="/register/step-1">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/dashboard">Go to dashboard</Link>
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
