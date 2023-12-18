import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthContext";
import Loader from "../../Loader";
import { useUser } from "../../Contexts/UserContext";
// import { useUser } from "../../Contexts/UserContext";

const profileTabs = [
  {
    title: "Profile",
  },
  {
    title: "Account",
  },
];

function TeacherProfile() {
  const [teacherInfo, setTeacherInfo] = useState([]);
  const [accountInfo, setAccountInfo] = useState([]);
  const [showStudentInfo, setShowStudentInfo] = useState(true);
  const [showAccountInfo, setShowAccountInfo] = useState(false);

  const { userDetails, isLoading } = useUser();

  // const [image, setImage] = useState("");
  const { authState } = useAuth();
  const userId = authState.userId;

  const handleShowStudentInfo = (index) => {
    if (index === 0) {
      setShowStudentInfo(true);
      setShowAccountInfo(false);
    } else if (index === 1) {
      setShowStudentInfo(false);
      setShowAccountInfo(true);
    }
  };

  useEffect(() => {
    fetchPersonalInfo(userId);
    fetchAccountInfo(userId);
  }, [userId]);

  const fetchPersonalInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/teacher/details/personal/${userId}`
      );

      const data = response.data;

      setTeacherInfo(data);
    } catch (error) {
      console.log("Error fetching personal information", error);
    }
  };

  const fetchAccountInfo = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/teacher/details/account/${userId}`
      );

      const data = response.data;

      setAccountInfo(data);
    } catch (error) {
      console.log("Error fetching account information", error);
    }
  };

  if (!userDetails) {
    return <Loader />;
  }
  return (
    <div>
      <div>
        <h1>View Your Teacher Information</h1>

        {isLoading ? (
          <Loader />
        ) : (
          <section className="grid grid-cols-[1fr_3fr] gap-8">
            <div className="flex flex-col items-center gap-0 border-r-2 pr-4">
              <img
                src={userDetails.profile_photo}
                alt={`${userDetails.first_name} ${userDetails.last_name} img`}
                className="rounded-full mb-2"
              />
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold">
                  {userDetails.first_name} {userDetails.last_name}
                </h3>
                <p>Teacher</p>
                <p>
                  Teacher ID:{" "}
                  <em className="font-semibold">{userDetails.teacher_id}</em>
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

                      <div>
                        <p>
                          <span>Name:</span> {userDetails.last_name}{" "}
                          {userDetails.first_name}
                        </p>
                        <p>
                          <span>Gender: </span>
                          {userDetails.gender}
                        </p>
                        <p>
                          <span>Age: </span> {userDetails.age}
                        </p>
                        <p>
                          <span>DOB: </span> {userDetails.date_of_birth}
                        </p>
                        <p>
                          <span>Ph: </span> {userDetails.phone_number}
                        </p>

                        <p>
                          <span>Address: </span> {userDetails.address}
                        </p>
                      </div>
                    </div>
                    <h2>Employee Details</h2>
                    {teacherInfo.map((data) => (
                      <div key={data.teacher_id}>
                        <p>Date Joined: {data.joining_date}</p>
                        <p>Status: {data.employee_status}</p>
                        <p>Qualifications: {data.qualifications}</p>
                        <p>Class Assigned: {data.class_code}</p>
                      </div>
                    ))}
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
    </div>

    // student profile
  );
}

export default TeacherProfile;
