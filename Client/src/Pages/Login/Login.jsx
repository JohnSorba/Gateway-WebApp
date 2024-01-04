/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../../comps/RegistrationDetails/Modal";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../Contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import "./Login.css";
import { useUser } from "../../Contexts/UserContext";

function Login({ modalOpen, setModalOpen }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({ username: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("password");
  // const [animate, setAnimate] = useState(false);
  const [loginStyle, setLoginStyle] = useState({
    error: false,
    success: false,
  });

  const { login, authState } = useAuth();
  const { isLoading, setIsLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.token) {
      // navigate("/home");
      navigate(`/dashboard/${authState.role}`);
    }
  }, [navigate, authState.token, authState.role]);

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
        setIsLoading(true);
        const response = await axios.post("http://localhost:3000/auth/login", {
          username,
          password,
        });

        console.log(response);

        const data = response.data;
        if (data) {
          // decode the token to access all values
          const decodedToken = jwtDecode(data.token);
          console.log("decoded token: ", decodedToken);

          login(
            data.token,
            decodedToken.role,
            decodedToken.username,
            decodedToken.userId
          );
          console.log("login data: ", data);

          setMessage(response.data.message);
          setLoginStyle({ error: false, success: true });
        } else {
          setMessage("No Internet Connection!");
        }
        console.log(response.data);
      } catch (error) {
        if (error) {
          // setAnimate(false);
          // setTimeout(() => setAnimate(true), 10);
          setMessage(error.response.data.error);
          setLoginStyle({ error: true, success: false });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUsernameInput = (e) => {
    setUsername(e.target.value);
    setLoginStyle({ success: false, error: false });
    setMessage("");
  };
  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
    setLoginStyle({ success: false, error: false });
    setMessage("");
  };

  return (
    <div className="login-container">
      <div className="left">
        <h2>
          <span>Welcome to</span>
          <span className="school-name text-yellow-500 font-bold">
            Gateway School
          </span>
          <span>Portal</span>
        </h2>
      </div>
      <div className={`login-page`}>
        <form
          onSubmit={handleLogin}
          noValidate
          className={`login-form  
          ${loginStyle.error ? "border-red" : ""}
          ${loginStyle.success ? "border-green" : ""}`}
        >
          {/* <p>Implement password Recovery</p> */}
          <img
            src="/gateway_logo_final.png"
            alt="logo"
            className="school-logo"
          />
          <h2 className="m-0 text-xl">Login</h2>

          {/* Username Input */}
          <div>
            <input
              type="text"
              className={`form-input ${errors.username ? "error" : ""}`}
              value={username}
              placeholder="Enter your username"
              onChange={handleUsernameInput}
              required
            />
          </div>

          {/* Password Input */}
          <div
            className={`password flex justify-between items-center  ${
              errors.password ? "error" : ""
            }`}
          >
            <input
              type={status}
              value={password}
              placeholder="Enter your password"
              onChange={handlePasswordInput}
              required
            />
            <div onClick={toggleShowPassword} className="cursor-pointer">
              {showPassword ? (
                <FaEye className="w-6 h-6" />
              ) : (
                <FaEyeSlash className="w-6 h-6" />
              )}
            </div>
          </div>

          <button
            className={`${
              isLoading
                ? "bg-green-600"
                : loginStyle.error === true
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
            type="submit"
          >
            <p>
              {isLoading
                ? "Signing In..."
                : loginStyle.error === true
                ? message
                : "Login"}
            </p>
          </button>
          {/* <p className={`login-message ${animate ? "animate" : ""}`}>
            {message}
          </p> */}
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
    </div>
  );
}

export default Login;
