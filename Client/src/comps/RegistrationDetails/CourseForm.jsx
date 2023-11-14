/* eslint-disable react/prop-types */
function CourseForm({ formData, prevStep }) {
  console.log("Form Data: ", formData);

  return (
    <div>
      <div>
        <h3>Admission Details:</h3>
        {/* <p>Admission Date: 04/02/2023</p> */}
        <p>Admission Date: {formData.admissionDate}</p>
        <p>Admission Number: {formData.admissionId}</p>
        <p>Student ID: {formData.studentId}</p>
        <p>Class: {formData.className}</p>
        <p>Status: {formData.admissionStatus}</p>
      </div>
      <button className="form-button" type="button" onClick={prevStep}>
        Back
      </button>
      <button className="form-button" type="button">
        Go to Dashboard
      </button>
    </div>
  );
}

export default CourseForm;
