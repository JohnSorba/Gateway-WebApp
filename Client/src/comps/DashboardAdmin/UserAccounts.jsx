import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../Contexts/UserContext";
import Loader from "../../Loader";
import { FaEdit, FaUserPlus } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function UserAccounts() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { isLoading, setIsLoading } = useUser();
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

      setUsers(response.data);
      console.log(response.data);
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
  const handleDeleteUser = (userId) => {
    try {
      setIsLoading(true);

      const response = axios.delete(
        `http://localhost:3000/users/delete/${userId}`
      );

      console.log(response);
      setMessage(response.data);
      fetchUsers();
    } catch (error) {
      console.log("Error deleting user: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNewUser = () => {
    navigate("/admin/register/step-1");
  };

  return (
    <div>
      <h1>User Account Information</h1>
      <button
        className="form-button flex gap-2 items-center"
        onClick={addNewUser}
      >
        <FaUserPlus />
        <span>Add New User</span>
      </button>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>###</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.user_id}>
                  <td className="bg-blue-50 border-r-2">00{i + 1}</td>
                  <td>
                    {user.role_name === "student"
                      ? user.sfirstname
                      : user.tfirstname}
                  </td>
                  <td>
                    {user.role_name === "student"
                      ? user.slastname
                      : user.tlastname}
                  </td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role_name}</td>
                  <td className="text-green-600 font-semibold">
                    {user.role_name === "student"
                      ? user.admission_status
                      : user.employee_status}
                  </td>
                  <td className="flex gap-4 justify-center items-center">
                    <FaEdit className="w-5 h-5 text-green-700" />
                    <AiOutlineDelete
                      className="w-5 h-5 text-red-700 cursor-pointer"
                      onClick={() => handleDeleteUser(user.user_id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div>
          <div className="modal-backdrop"></div>
          <div className="modal">
            <p>{message}</p>
            <button>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAccounts;
