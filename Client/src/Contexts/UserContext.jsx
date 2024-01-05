/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";
import { baseURL } from "../comps/Dashboard/DashboardData";

// create context
export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);

  const { authState } = useAuth();
  const userId = authState.userId;
  const token = authState.token;

  // console.log("user details: ", userDetails);

  // Function to make an authenticated request with the user's token
  const makeAuthenticatedRequest = async (url, token) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error making authenticated request: ");
      throw error;
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        // Make an authenticated request to the endpoint that uses the middleware
        const response = await makeAuthenticatedRequest(
          `${baseURL}/users/user/details`,
          token
        );

        // console.log(response);

        // console.log(response.user);
        // console.log(response.user.userDetails);
        localStorage.setItem("userDetails", response.user.userDetails);
        setUserDetails(response.user.userDetails);
      } catch (error) {
        // Handle errors, e.g., redirect to the login page
        console.error("Error fetching user details", error.response.data.error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchUserDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const storedDetails = localStorage.getItem("accountData");
    const storedUserDetails = localStorage.getItem("userDetails");
    setAccountInfo(storedDetails);
    setUserDetails(storedUserDetails);
  }, []);

  useEffect(() => {
    if (token) {
      fetchPersonalInfo(userId);
      fetchAccountInfo(userId);
    }
  }, [userId, token]);

  const fetchPersonalInfo = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/student/details/personal/${userId}`
      );
      const data = response.data;

      if (response.data) {
        setStudentInfo(data);
      }
    } catch (error) {
      console.error(
        "Error fetching personal information: ",
        error.response.data.error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccountInfo = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseURL}/student/details/account/${userId}`
      );
      const data = await response.data;
      if (response.data) {
        setAccountInfo(data);
      }

      localStorage.setItem("accountData", data);
    } catch (error) {
      console.error(
        "Error fetching account information",
        error.response.data.error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        token,
        isLoading,
        setIsLoading,
        studentInfo,
        accountInfo,
        userDetails,
        setUserDetails,
        makeAuthenticatedRequest,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// useUser Custom Hook
export function useUser() {
  return useContext(UserContext);
}
