/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import Modal from "./Modal";

function ConfirmDetails({
  formData,
  setFormData,
  prevStep,
  onModalOpen,
  modalOpen,
  onRegisterSuccess,
  setAnimate,
}) {
  const [message, setMessage] = useState("");
  // Form submit
  const submitForm = async (e) => {
    e.preventDefault();

    // Update form data

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        formData
      );
      console.log(response);

      if (response.data) {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            studentId: response.data.user.newStudentID,
            admissionId: response.data.user.newAdmissionID,
            teacherId: response.data.user.newTeacherID,
          };
        });

        console.log("teacherId: ", response.data.user.newTeacherID);

        onRegisterSuccess(true);
        onModalOpen(true);
        // Open modal on success
        // alert(response.data.message);
      } else {
        response.data.error;
        alert("Cannot retrieve data!");
        setAnimate(false);
        setTimeout(() => setAnimate(true), 10);
      }
    } catch (error) {
      onModalOpen(true);
      setMessage(error.response.data.error);
      console.error("Error submitting form: ", error.response.data.error);
    }
  };

  return (
    <div className="register-summary">
      <section className="flex justify-evenly gap-16">
        <div className="grow-[2] mb-6">
          <h3 className="text-xl font-semibold mb-6">User Account Details</h3>
          <p>
            <span>Username:</span> {formData.username}
          </p>
          <p>
            <span>Email:</span> {formData.email}
          </p>
          <p>
            <span>Class:</span> {formData.className}
          </p>
        </div>
        <div className="grow-[3] mb-6">
          {formData.roleId === 3 ? (
            <h3 className="text-xl font-semibold mb-6">
              Student Profile Information
            </h3>
          ) : (
            <h3 className="text-xl font-semibold mb-6">
              Teacher Profile Information
            </h3>
          )}

          <img
            src={formData.profilePhoto}
            alt={formData.firstName}
            className="rounded-full h-24 w-24 mb-4"
          />
          <p>
            <span>First Name:</span> {formData.firstName}
          </p>
          <p>
            <span>Last Name:</span> {formData.lastName}
          </p>
          <p>
            <span>Gender:</span> {formData.gender}
          </p>
          <p>
            <span>Age:</span> {formData.age}
          </p>
          <p>
            <span>Phone Number:</span> {formData.phoneNumber}
          </p>
          <p>
            <span>Address:</span> {formData.address}
          </p>

          {/* Student Specific Data */}
          {formData.roleId === 3 && (
            <>
              <p>
                <span>Parent Name:</span> {formData.parentName}
              </p>
              <p>
                <span>Parent Contact:</span> {formData.parentContact}
              </p>
            </>
          )}

          {/* Teacher specific Info */}
          {formData.roleId === 2 && (
            <p>
              <span>Career Qualifications:</span> {formData.qualifications}
            </p>
          )}
        </div>
      </section>
      <Modal isOpen={modalOpen}>{message}</Modal>
      <p className="errors">{message}</p>

      <div className="flex justify-between">
        {/* <p>{message}</p> */}
        <button className="form-button" type="button" onClick={prevStep}>
          Back
        </button>

        <button className="form-button" type="button" onClick={submitForm}>
          Complete Registration
        </button>
      </div>
    </div>
  );
}

export default ConfirmDetails;

// profilePhoto: null,

// function getAdmissionDate() {
//   const date = new Date();
//   const day = date.getDate();
//   const month = date.getMonth() + 1;
//   const year = date.getFullYear();
//   const admissionDate = `${year}-${month}-${day}`;

//   return admissionDate;
// }
// const admissionDate = getAdmissionDate();
