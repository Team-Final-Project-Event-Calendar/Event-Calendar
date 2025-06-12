import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./Authentication.css";

function Authentication() {
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
    isBlocked: false,
  });
  const [error, setError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const updateUser = (prop) => (e) =>
    setUser({ ...user, [prop]: e.target.value });

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      setSuccessMessage("");
      setError({ general: "Please enter email and password" });
      return;
    }
    try {
      await login(user.email, user.password);
      setError({});
      setSuccessMessage("✅ Successfully logged in.");
      navigate(location.state?.from?.pathname ?? "/");
    } catch (err) {
      console.error("Login failed:", err);
      const message =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Login failed!";
      setError({ general: message });
      setSuccessMessage("");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!user.username || user.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }

    if (!/^0\d{9}$/.test(user.phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must start with 0, contain only digits, and be exactly 10 digits.";
    }

    if (!user.email || !/^\S+@\S+\.\S+$/.test(user.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (
      !user.password ||
      user.password.length < 8 ||
      !/[A-Za-z]/.test(user.password)
    ) {
      newErrors.password =
        "Password must be 8+ characters and include at least one letter.";
    }

    if (!user.firstName || !/^[A-Za-z]{1,30}$/.test(user.firstName)) {
      newErrors.firstName =
        "First name must be 1-30 characters and contain only letters.";
    }

    if (!user.lastName || !/^[A-Za-z]{1,30}$/.test(user.lastName)) {
      newErrors.lastName =
        "Last name must be 1-30 characters and contain only letters.";
    }

    if (user.isBlocked) {
      newErrors.isBlocked =
        "Your account has been blocked. Please contact the administrator.";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    const { username, phoneNumber, email, password, firstName, lastName } = user;

    try {
      await register({
        username,
        phoneNumber,
        email,
        password,
        firstName,
        lastName,
      });

      setSuccessMessage("✅ Registration successful! Please login.");
      setMode("login");
      setUser({
        username: "",
        phoneNumber: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        isBlocked: false,
      });
      setError({});
    } catch (err) {
      console.error("❌ Failed to register:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        "❌ Failed to register.";
      setError({ general: msg });
      setSuccessMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "register" && !validate()) return;
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
            <button onClick={() => setMode("login")} disabled={mode === "login"}>
              Login
            </button>
            <button onClick={() => setMode("register")} disabled={mode === "register"}>
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{mode === "login" ? "Login" : "Register"}</h2>

            {successMessage && <div className="success">{successMessage}</div>}
            {error.general && <div className="error">{error.general}</div>}

            {mode === "register" && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={user.username}
                    onChange={updateUser("username")}
                  />
                  {error.username && <div className="error">{error.username}</div>}
                </div>

                <div>
                  <input
                    type="tel"
                    value={user.phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setUser({ ...user, phoneNumber: val });
                    }}
                    name="phoneNumber"
                    id="phoneNumber"
                    pattern="^0\d{9}$"
                    required
                    placeholder="Enter phone number"
                  />
                  {error.phoneNumber && <div className="error">{error.phoneNumber}</div>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={user.firstName}
                    onChange={updateUser("firstName")}
                  />
                  {error.firstName && <div className="error">{error.firstName}</div>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={user.lastName}
                    onChange={updateUser("lastName")}
                  />
                  {error.lastName && <div className="error">{error.lastName}</div>}
                </div>
              </>
            )}

            <div>
              <input
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={updateUser("email")}
              />
              {error.email && <div className="error">{error.email}</div>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={updateUser("password")}
              />
              {error.password && <div className="error">{error.password}</div>}
            </div>

            <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Authentication;
