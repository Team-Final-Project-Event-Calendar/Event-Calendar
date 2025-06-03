//Auth.Context.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();
const key = import.meta.env.VITE_FRONT_END_URL
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${key}/api/auth/login` || "http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    const data = res.data;

    let fullUser = data.user;
    if (fullUser && fullUser.id) {
      try {
        const profileRes = await axios.get(
         `${key}/api/auth/users` ||
          `http://localhost:5000/api/auth/users`,
          {
            headers: { Authorization: `Bearer ${data.token}` },
          }
        );
        const found = Array.isArray(profileRes.data)
          ? profileRes.data.find((u) => u._id === fullUser.id)
          : null;
        if (found) fullUser = found;
      } catch (e) {
      }
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(fullUser));
    setToken(data.token);
    setUser(fullUser);
    return fullUser;
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
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
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setToken(null);
    setUser(null);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}
