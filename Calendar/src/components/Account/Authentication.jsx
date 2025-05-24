import { useNavigate, useLocation } from "react-router-dom";
import React from "react";
import { useState } from "react";
import axios from "axios";

export default function Authentication() {
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState({
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
    const { email, password } = user;
    if (!email || !password) {
      return alert("Please enter an email and password");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const data = res.data;
      console.log("Login successful!", data);
      alert("Login successful!");
      navigate(location.state?.from?.pathname ?? "/");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert("Login failed!");
    }
  };

  const handleRegister = async () => {
    const { email, password, firstName, lastName } = user;
    console.log(user, "hope is currently working");

    if (!email || !password || !firstName || !lastName) {
      return alert("Please fill in all fields");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });

      console.log("Registration successful!", res.data);
      alert("Registration successful! Please login.");
      setMode("login");
      setUser({ email: "", password: "", firstName: "", lastName: "" });
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert("Registration failed!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => setMode("login")}
          disabled={mode === "login"}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          disabled={mode === "register"}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>

        {mode === "register" && (
          <>
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

        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      </form>
    </div>
  );
}
