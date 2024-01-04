import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../App.css";
import { Link } from "react-router-dom";

function ComingSoon() {
  return (
    <section className="grid items-center justify-center h-full bg-slate-900">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center">
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="h-40 w-40 logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img
              src={reactLogo}
              className="h-40 w-40 logo react"
              alt="React logo"
            />
          </a>
        </div>
        <h1 className="font-semibold mb-0 text-white">
          Gateway School Web Application
        </h1>
        <p className=" text-white text-md">
          By Daniel Ndanema — 1100602083 — Major Project II
        </p>
        <h3 className="text-2xl text-white">In Progress!</h3>

        <Link to="home" className="intro-link bg-green-500">
          Go to Project
        </Link>
      </div>
    </section>
  );
}

export default ComingSoon;
