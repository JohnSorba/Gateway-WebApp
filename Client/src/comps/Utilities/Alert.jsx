import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Alert.css";
import { FaCheckCircle } from "react-icons/fa";

function Alert({ type, message, onClose, isVisible }) {
  const [isRendered, setIsRendered] = useState(isVisible);

  useEffect(() => {
    setIsRendered(isVisible);

    // Code to run on component mount
    const timer = setTimeout(() => {
      setIsRendered(false);
      onClose();
    }, 5000); // Auto-dismiss after 3 seconds

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isRendered) return null;

  return (
    <div className="alert-container">
      <div className={`alert ${type}`}>
        <FaCheckCircle className="h-12 w-12" />
        {message}
        <span className="close-button" onClick={onClose}>
          OK
        </span>
      </div>
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.string.isRequired, // success or failure
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default Alert;
