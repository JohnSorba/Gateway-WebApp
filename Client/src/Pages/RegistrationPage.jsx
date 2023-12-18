/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

import UserAccountInfo from "../comps/RegistrationDetails/UserAccountInfo";
import ProfileInformation from "../comps/RegistrationDetails/ProfileInformation";
import ConfirmDetails from "../comps/RegistrationDetails/ConfirmDetails";
import ProgressIndicator from "../comps/RegistrationDetails/ProgressIndicator";
import { initialFormData } from "../comps/RegistrationDetails/RegistrationData";
import CourseForm from "../comps/RegistrationDetails/CourseForm";
import Modal from "../comps/RegistrationDetails/Modal";

initialFormData;

function RegistrationPage({ modalOpen, setModalOpen, setAnimate }) {
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState(initialFormData);

  // console.log(isRegisterSuccess);

  const navigate = useNavigate();
  // console.log(formErrors);

  const nextStep = () => {
    const errors = validateCurrentStep(formData, currentStep);

    if (Object.keys(errors).length === 0) {
      setCurrentStep(currentStep);
    } else {
      setFormErrors(errors);
    }

    if (errors === true) {
      setCurrentStep(currentStep + 1);
      navigate(`/admin/register/step-${currentStep + 1}`);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    navigate(-1);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentStep(4);
    navigate("/admin/register/step-4");
    isRegisterSuccess;
  };

  // Account Form validation
  const validateAccountDetails = (formData) => {
    // Add regex patterns here for validation as constants
    const usernamePattern = /^[a-zA-Z0-9_]{3,10}$/;
    const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    let errors = {};
    let isValid = true;

    // Username validation
    if (!formData.username) {
      errors.username = "Username is required";
      isValid = false;

      setAnimate(false);
      setTimeout(() => setAnimate(true), 10);
    } else if (!usernamePattern.test(formData.username)) {
      errors.username =
        "Username must be 3-10 characters long and can only contain alphanumeric characters and underscores.";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required.";
      isValid = false;
    } else if (!passwordPattern.test(formData.password)) {
      errors.password =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
      isValid = false;
    }

    // Update the errors state with any validation errors
    setFormErrors(errors);

    // If all validations pass, return true
    return isValid;
  };
  // console.log(validateAccountDetails(formData));

  // Profile Form validation
  const validatePersonalDetails = (formData) => {
    // Adjust as per your requirements
    const namePattern = /^[a-zA-Z]+(?:['-.,\s][a-zA-Z]+)*$/;
    // International format with optional country code
    const phonePattern =
      /^\+?(\d{1,3})?[-. ]?\(?\d{1,4}\)?[-. ]?\d{1,4}[-. ]?\d{1,4}[-. ]?\d{1,9}$/;
    // date of birth

    const dobPattern = /^\d{4}-\d{2}-\d{2}$/;
    const qualificationsPattern = /^[\w\s]+(,\s*[\w\s]+)*$/;

    let errors = {};
    let isValid = true;

    // First Name validation
    if (!formData.firstName) {
      errors.firstName = "Your first name is required";
      isValid = false;
    } else if (!namePattern.test(formData.firstName)) {
      errors.firstName = "Your first name contains invalid characters.";
      isValid = false;
    }

    // Last Name validation
    if (!formData.lastName) {
      errors.lastName = "Your last name is required";
      isValid = false;
    } else if (!namePattern.test(formData.lastName)) {
      errors.lastName = "Your last name contains invalid characters.";
      isValid = false;
    }

    // Last Name validation
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Your date of birth is required";
      isValid = false;
    } else if (!dobPattern.test(formData.dateOfBirth)) {
      errors.dateOfBirth = "Date of birth is not in a valid format.";
      isValid = false;
    }

    // Phone Number validation
    if (!formData.phoneNumber) {
      errors.phoneNumber = "Your phone number is required";
      isValid = false;
    } else if (!phonePattern.test(formData.phoneNumber)) {
      errors.phoneNumber = "Your phone number is not in a valid format.";
      isValid = false;
    }

    // Address validation - here's a simple non-empty check
    if (!formData.address) {
      errors.address = "Your address is required";
      isValid = false;
    }

    const validateStudentFields = (formData) => {
      let errors = {};
      // Parent Name validation
      if (!formData.parentName) {
        errors.parentName = "Parent / Guardian's full name is required";
        isValid = false;
      } else if (!namePattern.test(formData.parentName)) {
        errors.parentName = "Name contains invalid characters.";
        isValid = false;
      }

      // Parent Phone Number validation
      if (!formData.parentContact) {
        errors.parentContact =
          "Your parent / guardian's phone number is required";
        isValid = false;
      } else if (!phonePattern.test(formData.parentContact)) {
        errors.parentContact = "phone number is not in a valid format.";
        isValid = false;
      }

      return errors;
    };

    const validateTeacherFields = (formData) => {
      let errors = {};
      // Parent Name validation
      if (!formData.qualifications) {
        errors.qualifications = "Qualifications are required";
        isValid = false;
      } else if (!qualificationsPattern.test(formData.qualifications)) {
        errors.qualifications = "Qualifications contains invalid characters.";
        isValid = false;
      }

      return errors;
    };

    if (formData.roleId === 3) {
      errors = { ...formErrors, ...validateStudentFields(formData) };
    } else if (formData.roleId === 2) {
      errors = { ...formErrors, ...validateTeacherFields(formData) };
    }

    // Update the errors state with any validation errors
    setFormErrors(errors);

    // If all validations pass, return true
    return isValid;
  };

  // console.log(errors);

  const validateCurrentStep = (formData, currentStep) => {
    switch (currentStep) {
      case 1:
        return validateAccountDetails(formData);
      case 2:
        return validatePersonalDetails(formData);
      default:
        return true; // No validation needed or last step always passes
    }
  };

  const styles = {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "4% 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  };

  const heading = [
    "Account Information",
    "Personal Information",
    "Confirm Details",
    "Course Advisory Form",
  ];
  const title = heading[currentStep - 1];

  return (
    <div style={styles} className="registration-page">
      <p className="text-center">
        Please Fill in the details and do not refresh this page.
      </p>
      <h1 className="mb-6 text-3xl">
        User Registration - <em className="text-blue-500">{title}</em>
      </h1>

      <ProgressIndicator currentStep={currentStep} />

      {/* Display the corresponding step at each stage of registration */}
      {currentStep === 1 && (
        <UserAccountInfo
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          nextStep={nextStep}
        />
      )}
      {currentStep === 2 && (
        <ProfileInformation
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          nextStep={nextStep}
          prevStep={prevStep}
        />
      )}
      {currentStep === 3 && (
        <ConfirmDetails
          formData={formData}
          setFormData={setFormData}
          prevStep={prevStep}
          nextStep={nextStep}
          onModalOpen={setModalOpen}
          onRegisterSuccess={setIsRegisterSuccess}
        />
      )}
      <Modal isOpen={modalOpen} formData={formData}>
        <FaCheckCircle className="modal-icon" />
        <h1>Registration Successful!</h1>
        <p>
          Congratulations on your admission to Gateway Pre School,{" "}
          {formData.firstName}. You are most welcome and we are truly excited to
          have you on board!
        </p>
        <button className="modal-close-button" onClick={handleCloseModal}>
          Click to view your admission details.
        </button>
      </Modal>
      {currentStep === 4 && (
        <CourseForm formData={formData} prevStep={prevStep} />
      )}
    </div>
  );
}

export default RegistrationPage;
