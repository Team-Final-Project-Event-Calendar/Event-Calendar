import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

/**
 * React Context object for authentication state and methods.
 * @type {React.Context<AuthContextType>}
 */
export const AuthContext = createContext();

/**
 * Base URL for backend API, from environment variable or fallback localhost.
 * @constant {string}
 */
const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

/**
 * Authentication context provider component.
 * Provides user authentication state and functions to login, logout, and register.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - React child components that will consume the auth context.
 * @returns {JSX.Element} The AuthContext provider wrapping the children.
 */
export default function AuthProvider({ children }) {
  /**
   * Currently authenticated user object or null if not authenticated.
   * @type {[Object|null, React.Dispatch<React.SetStateAction<Object|null>>]}
   */
  const [user, setUser] = useState(null);

  /**
   * Authentication token string or null if not authenticated.
   * @type {[string|null, React.Dispatch<React.SetStateAction<string|null>>]}
   */
  const [token, setToken] = useState(null);

  /**
   * Loading state to indicate whether the auth status is being initialized.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
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

  /**
   * Performs login by sending email and password to backend.
   * Stores token and user info on success.
   *
   * @async
   * @function login
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @returns {Promise<Object|null>} Returns full user object if login is successful.
   * @throws Will throw an error if login fails.
   */
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

  /**
   * Registers a new user by sending user data to backend.
   *
   * @async
   * @function register
   * @param {Object} userData - The user registration data.
   * @returns {Promise<Object>} Returns response data on successful registration.
   * @throws Will throw an error if registration fails.
   */
  const register = async (userData) => {
    try {
      const res = await axios.post(`${key}/api/auth/register`, userData);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };

  /**
   * Logs out the current user by clearing local storage and notifying backend.
   *
   * @async
   * @function logout
   * @returns {Promise<void>} Returns a promise that resolves when logout completes.
   */
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

  /**
   * Boolean flag indicating if user is logged in.
   * @type {boolean}
   */
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isLoggedIn,
        loading,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
