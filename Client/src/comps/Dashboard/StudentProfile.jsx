import { useState } from "react";
import Loader from "../../Loader";
import { useAuth } from "../../Contexts/AuthContext";
import { useUser } from "../../Contexts/UserContext";

const profileTabs = [
  {
    title: "Profile",
  },
  {
    title: "Account",
  },
];

function StudentProfile() {
  const { studentInfo, accountInfo, isLoading } = useUser();
  const [showStudentInfo, setShowStudentInfo] = useState(true);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  // const [newImage, setNewImage] = useState("");
  const studentDetails = studentInfo && studentInfo[0];
  const accountDetails = accountInfo && accountInfo[0];

  const { authState } = useAuth();

  const handleShowStudentInfo = (index) => {
    if (index === 0) {
      setShowStudentInfo(true);
      setShowAccountInfo(false);
    } else if (index === 1) {
      setShowStudentInfo(false);
      setShowAccountInfo(true);
    }
  };

  if (!studentInfo) {
    return <Loader />;
  }

  return (
    <div>
      <h1>View Your Student Information</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <section className="grid grid-cols-[1fr_3fr] gap-8">
          <div className="flex flex-col items-center gap-0 border-r-2 pr-4">
            <img
              src={studentDetails.profile_photo}
              alt={`${studentDetails.first_name} ${studentDetails.last_name} img`}
              className="rounded-full mb-2"
            />
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">
                {studentDetails.first_name} {studentDetails.last_name}
              </h3>
              <p>
                {accountDetails.role_id === 3
                  ? "Student"
                  : accountDetails.role_id === 2
                  ? "Teacher"
                  : "Admin"}
              </p>
              <p>
                Student ID:{" "}
                <em className="font-semibold">{studentDetails.student_id}</em>
              </p>
            </div>
            <div className="flex gap-4">
              {profileTabs.map((item, index) => (
                <button
                  key={item.title}
                  onClick={() => handleShowStudentInfo(index)}
                  className="form-button"
                >
                  {item.title}
                </button>
              ))}
            </div>

            {/* <input
            type="file"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
          /> */}
          </div>

          <section>
            <div>
              {showStudentInfo && (
                <>
                  <div className="mb-8">
                    <h2>Profile Information</h2>
                    {studentInfo.map((data) => (
                      <div key={data.student_id}>
                        <p>
                          <span>Name:</span> {data.last_name} {data.first_name}
                        </p>
                        <p>
                          <span>Gender: </span>
                          {data.gender}
                        </p>
                        <p>
                          <span>Age: </span> {data.age}
                        </p>
                        <p>
                          <span>DOB: </span> {data.date_of_birth}
                        </p>
                        <p>
                          <span>Ph: </span> {data.phone_number}
                        </p>
                        <p>
                          <span>Parent Name: </span> {data.parent_name}
                        </p>
                        <p>
                          <span>Parent Contact: </span> {data.parent_contact}
                        </p>
                        <p>
                          <span>Address: </span> {data.address}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h2>Admission Information</h2>
                    {studentInfo.map((data) => (
                      <div key={data.student_id}>
                        <p>Student ID: {data.student_id}</p>
                        <p>Admission ID: {data.admission_id}</p>
                        <p>Admission Date: {data.admission_date}</p>
                        <p>Admission Status: {data.admission_status}</p>
                        <p>Class Enrolled: {data.class_code}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div>
              {showAccountInfo && (
                <>
                  <div>
                    <h2>Account Details</h2>
                    {accountInfo.map((data) => (
                      <div key={data.user_id}>
                        <p>Account ID: {data.user_id}</p>
                        <p>Username: {data.username}</p>
                        <p>Account Type: {authState.role}</p>
                        <p>Email: {data.email}</p>
                      </div>
                    ))}
                    <div>
                      <article className="form-group">
                        <label className="form-label">Current Password</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Current Password"
                        />
                      </article>
                      <article className="form-group">
                        <label className="form-label">New Password</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="New Password"
                        />
                      </article>
                      <article className="form-group">
                        <label className="form-label">
                          Re-enter New Password
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Re-enter Password"
                        />
                      </article>
                      <button className="form-button" type="submit">
                        Update Password
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </section>
      )}
    </div>
  );
}

export default StudentProfile;
