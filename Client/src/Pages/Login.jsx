/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../comps/RegistrationDetails/Modal";
import { FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../Contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

function Login({ modalOpen, setModalOpen }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ username: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("password");
  const [animate, setAnimate] = useState(false);

  const { login, authState } = useAuth();
  // console.log("role: ", authState.user.role);

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
    navigate(`/dashboard/${authState.role}`);
  };

  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;
    let newErrors = { username: false, password: false };

    if (!username && !password) {
      newErrors.username = true;
      newErrors.password = true;
      isValid = false;
      setMessage("Username and Password is required");
    } else if (!username) {
      newErrors.username = true;
      isValid = false;
      setMessage("Username is required");
    } else if (!password) {
      newErrors.password = true;
      isValid = false;
      setMessage("Password is required");
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await axios.post("http://localhost:3000/auth/login", {
          username,
          password,
        });

        const data = response.data;
        if (response.data) {
          // decode the token to access all values
          const decodedToken = jwtDecode(data.token);
          console.log("decoded token: ", decodedToken);

          login(data.token, decodedToken.role, decodedToken.username);
          console.log("login data: ", data);
          // navigate(`/dashboard/${data.role}`);

          // login(response.data);

          setMessage(response.data.message);
          setModalOpen(true);
        }
        // console.log(response.data);
      } catch (error) {
        setAnimate(false);
        setTimeout(() => setAnimate(true), 10);
        setMessage(error.response.data.error);
        console.log(error.response.data.error);

        // console.error(error);
      }
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} noValidate className="login-form">
        <h2>User Login</h2>
        <div className="form-group">
          <input
            type="text"
            className={`form-input ${errors.username ? "error" : ""}`}
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type={status}
            className={`form-input ${errors.password ? "error" : ""}`}
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