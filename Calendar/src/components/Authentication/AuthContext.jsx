import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";


export default function AuthProvider({ children }) {
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
    
      if (storedToken && storedUser && storedUser !== "undefined") {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Invalid stored user:", storedUser, e);
          localStorage.removeItem("user");
        }
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${key}/api/auth/login`, {
      email,
      password,
    });
    const data = res.data;

    let fullUser = data.user;
    if (fullUser && fullUser.id) {
      try {
        const profileRes = await axios.get(`${key}/api/auth/users`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const found = Array.isArray(profileRes.data)
          ? profileRes.data.find((u) => u._id === fullUser.id)
          : null;
        if (found) fullUser = found;
      } catch (e) {
        console.error("Fetching full user failed", e);
      }
    }

    localStorage.setItem("token", data.token);
    if (fullUser) {
      localStorage.setItem("user", JSON.stringify(fullUser));
    } else {
      localStorage.removeItem("user");
    }

    setToken(data.token);
    setUser(fullUser);
    return fullUser;
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(
        `${key}/api/auth/register`,
        userData
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await fetch(`${key}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setToken(null);
    setUser(null);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoggedIn,loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
