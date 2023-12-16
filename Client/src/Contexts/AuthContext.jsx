/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

// AuthContext for Global Authentication Management

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// create context
export const AuthContext = createContext(null);

// Provider component
export function AuthProvider({ children }) {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [authState, setAuthState] = useState({
    token: null,
    username: null,
    role: null,
    userId: null,
  });

  // Function to update state on login
  const login = (token, role, username, userId) => {
    localStorage.setItem("token", token);
    setAuthState({
      token: token,
      role: role,
      username: username,
      userId: userId,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accountData");
    setAuthState({ token: null, role: null, username: null, userId: null });

    // localStorage.removeItem("userData");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);

      setAuthState({
        token,
        role: decodedToken.role,
        username: decodedToken.username,
        userId: decodedToken.userId,
      });
      setIsAuthChecked(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, isAuthChecked, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}
