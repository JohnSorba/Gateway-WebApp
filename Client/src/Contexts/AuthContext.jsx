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
  });

  // Function to update state on login
  const login = (token, role, username) => {
    localStorage.setItem("token", token);
    setAuthState({ token, role, username });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({ token: null, role: null, username: null });

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
      });
    }

    setIsAuthChecked(true);
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
