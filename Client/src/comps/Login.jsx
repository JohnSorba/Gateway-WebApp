/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./RegistrationDetails/Modal";
import { FaCheckCircle } from "react-icons/fa";

function Login({ modalOpen, setModalOpen }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("password");
  const [animate, setAnimate] = useState(false);

  const toggleStatus = () => {
    if (showPassword) setStatus("password");
    if (!showPassword) setStatus("text");
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    toggleStatus();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/dashboard");
  };

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        setMessage(response.data.message);
        setModalOpen(true);
      }
      console.log(response.data);
    } catch (error) {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 10);
      setMessage(error.response.data.error);
      console.log(error.response.data.error);

      // console.error(error);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} noValidate className="login-form">
        <h2>User Login</h2>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type={status}
            className="form-input"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="show-password">
          <label htmlFor="showPassword" className="check-form-label">
            Show Password
          </label>
          <input
            type="checkbox"
            className="check-form-input"
            id="showPassword"
            value={showPassword}
            onChange={toggleShowPassword}
          />
        </div>

        <button className="form-button" type="submit">
          Login
        </button>
        <p className={`login-message ${animate ? "animate" : ""}`}>{message}</p>
      </form>
      {/* Open modal on login success */}
      <Modal isOpen={modalOpen}>
        <FaCheckCircle className="modal-icon" />
        <h1>Login Successful!</h1>
        <button className="modal-close-button" onClick={handleCloseModal}>
          Go to your Dashboard!
        </button>
      </Modal>
    </div>
  );
}

export default Login;
