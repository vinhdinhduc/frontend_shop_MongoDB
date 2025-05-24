// AuthContext.js
import React, { createContext, useEffect, useContext, useState } from "react";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // tách user và token ra
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const isLoggedIn = !!user;

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setUser(user);
      setToken(token);
    }
  }, []);
  const validateToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/auth/validate",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.valid;
    } catch (error) {
      logout();
      return false;
    }
  };

  const login = ({ user, token }) => {
    // lưu cả user + token vào localStorage
    localStorage.setItem("auth", JSON.stringify({ user, token }));
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, login, logout, validateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
