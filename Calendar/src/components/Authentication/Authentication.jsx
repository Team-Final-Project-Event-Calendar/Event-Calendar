import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Authentication.css";

export default function Authentication() {
  const { login, register, logout, isLoggedIn, user: loggedUser } = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  const updateUser = (prop) => (e) => setUser({ ...user, [prop]: e.target.value });

  const handleLogin = async () => {
    if (!user.email || !user.password) return alert("Please enter email and password");
    try {
      await login(user.email, user.password);
      alert("Login successful!");
      navigate(location.state?.from?.pathname ?? "/");
    } catch (err) {
      console.error("Login failed:", err);
      const message =
        err?.response?.data?.msg || err?.response?.data?.message || "Login failed!";
      alert(message);
    }
  };

  const handleRegister = async () => {
    const { username, email, password, firstName, lastName } = user;
    if (!username || !email || !password || !firstName || !lastName) {
      return alert("Please fill in all fields");
    }
    try {
      await register({ username, email, password, firstName, lastName });
      alert("Registration successful! Please login.");
      setMode("login");
      setUser({ username: "", email: "", password: "", firstName: "", lastName: "" });
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
            <button onClick={() => setMode("login")} disabled={mode === "login"}>Login</button>
            <button onClick={() => setMode("register")} disabled={mode === "register"}>Register</button>
          </div>
  
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{mode === "login" ? "Login" : "Register"}</h2>
  
            {mode === "register" && (
              <>
                <input type="text" placeholder="Username" value={user.username} onChange={updateUser("username")} />
                <input type="text" placeholder="First Name" value={user.firstName} onChange={updateUser("firstName")} />
                <input type="text" placeholder="Last Name" value={user.lastName} onChange={updateUser("lastName")} />
              </>
            )}
            <input type="email" placeholder="Email" value={user.email} onChange={updateUser("email")} />
            <input type="password" placeholder="Password" value={user.password} onChange={updateUser("password")} />
            <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
          </form>
        </>
      )}
    </div>
  );
  
}