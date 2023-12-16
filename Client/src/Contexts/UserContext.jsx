/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

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
    const storedDetails = localStorage.getItem("accountData");
    setAccountInfo(storedDetails);
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
        `http://localhost:3000/student/details/personal/${userId}`
      );
      const data = await response.data;

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
        `http://localhost:3000/student/details/account/${userId}`
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
