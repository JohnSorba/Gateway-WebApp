import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../Contexts/UserContext";
import Loader from "../../Loader";
import { FaEdit, FaUser, FaUserPlus } from "react-icons/fa";
import { MdDateRange, MdEmail } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Alert from "../Utilities/Alert";

function UserAccounts() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState({ open: false, userId: null });
  const { isLoading, setIsLoading } = useUser();
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:3000/users/get-all-users"
      );

      const data = response.data;

      setUsers(data);
    } catch (error) {
      console.error(
        "Error fetching user account info: ",
        error.response.data.error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      setIsLoading(true);

      const response = await axios.delete(
        `http://localhost:3000/users/delete/${userId}`
      );

      setMessage(response.data);
      setShowModal(false);
      fetchUsers();
      setShowAlert(true);
    } catch (error) {
      console.log("Error deleting user: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowModal = (userId) => {
    setShowModal({ open: true, userId: userId });
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const addNewUser = () => {
    navigate("/admin/register/step-1");
  };

  function convertDateFormat(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JS
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${day}-${month}-${year}`;
  }

  return (
    <div>
      <h1>User Account Information</h1>
      <div className="flex justify-between mb-8">
        <input
          type="search"
          placeholder="Filter by username, user type..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-input w-[400px]"
        />
        <button
          className="form-button z-0 flex gap-2 items-center"
          onClick={addNewUser}
        >
          <FaUserPlus />
          <span>New Admission</span>
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>###</th>
                <th className="flex gap-1 items-center">
                  <FaUser />
                  Full Name
                </th>
                <th>Username</th>
                <th className="flex gap-1 items-center">
                  <MdEmail />
                  Email
                </th>
                <th>User Type</th>
                <th className="flex gap-1 items-center">
                  <MdDateRange /> Date Joined
                </th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(
                  (item) =>
                    item.role_name
                      .toLowerCase()
                      .includes(query.toLowerCase()) ||
                    item.username.toLowerCase().includes(query.toLowerCase())
                )
                .map((user, i) => (
                  <tr key={user.user_id}>
                    <td className="bg-blue-50 border-r-2">00{i + 1}</td>
                    <td>
                      {user.role_name === "student"
                        ? user.sfirstname
                        : user.tfirstname}{" "}
                      {user.role_name === "student"
                        ? user.slastname
                        : user.tlastname}
                    </td>

                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      {" "}
                      <span
                        className={`py-1 px-2 rounded-xl font-semibold ${
                          user.role_name === "student"
                            ? "bg-blue-200"
                            : "bg-green-300"
                        } `}
                      >
                        {user.role_name}
                      </span>
                    </td>
                    <td>
                      {user.role_name === "student"
                        ? convertDateFormat(user.admission_date)
                        : convertDateFormat(user.joining_date)}
                    </td>
                    <td className="text-green-600 font-semibold">
                      {user.role_name === "student"
                        ? user.admission_status
                        : user.employee_status}
                    </td>
                    <td className="flex gap-4 justify-center items-center">
                      <FaEdit className="w-5 h-5 text-green-700" />
                      <AiOutlineDelete
                        className="w-5 h-5 text-red-700 cursor-pointer"
                        onClick={() => handleShowModal(user.user_id)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal.open && (
        <div>
          <div className="modal-backdrop"></div>
          <div className="modal flex flex-col gap-4 items-center">
            <p className="text-lg font-semibold">
              Are you sure you want to delete this account?
            </p>
            <p>You will lose all records related to this user!</p>
            <div className="flex gap-4">
              <button onClick={() => setShowModal({ open: false, id: null })}>
                Cancel
              </button>
              <button
                className="bg-red-600"
                onClick={() => handleDeleteUser(showModal.userId)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <Alert
        type="success"
        message={message}
        onClose={handleCloseAlert}
        isVisible={showAlert}
      />
    </div>
  );
}

export default UserAccounts;
