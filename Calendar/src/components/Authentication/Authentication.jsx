import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Authentication.css";
import axios from "axios";

export default function Authentication() {
  const {
    login,
    register,
    logout,
    isLoggedIn,
    user: loggedUser,
  } = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const updateUser = (prop) => (e) =>
    setUser({ ...user, [prop]: e.target.value });

  const handleLogin = async () => {
    if (!user.email || !user.password)
      return alert("Please enter email and password");
    try {
      await login(user.email, user.password);
      alert("Login successful!");
      navigate(location.state?.from?.pathname ?? "/");
    } catch (err) {
      console.error("Login failed:", err);
      const message =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Login failed!";
      alert(message);
    }
  };

  const handleRegister = async () => {
    const { username, phoneNumber, email, password, firstName, lastName } = user;
    if (
      !username ||
      !phoneNumber ||
      !email ||
      !password ||
      !firstName ||
      !lastName
    ) {
      return alert("Please fill in all fields");
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        phoneNumber,
        email,
        password,
        firstName,
        lastName,
      });
      alert("Registration successful! Please login.");
      setMode("login");
      setUser({
        username: "",
        phoneNumber: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      });
    } catch (err) {
      console.error("Registration failed:", err.message);
      alert(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mode === "login" ? handleLogin() : handleRegister();
  };

  return (
    <div className="auth-container">
      {isLoggedIn ? (
        <div className="auth-logged-in">
          <h2>Welcome, {loggedUser?.firstName || "User"}!</h2>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <>
          <div className="auth-toggle">
            <button
              onClick={() => setMode("login")}
              disabled={mode === "login"}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              disabled={mode === "register"}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{mode === "login" ? "Login" : "Register"}</h2>

            {mode === "register" && (
              <>
                <div>
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={user.username}
                    onChange={updateUser("username")}
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="tel"
                    value={user.phoneNumber}
                    onChange={updateUser("phoneNumber")}
                    name="phoneNumber"
                    id="phoneNumber"
                    pattern="^\d{7,15}$"
                    required
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={user.firstName}
                    onChange={updateUser("firstName")}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={user.lastName}
                    onChange={updateUser("lastName")}
                    placeholder="Enter your last name"
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={user.email}
                onChange={updateUser("email")}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={user.password}
                onChange={updateUser("password")}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit">
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
