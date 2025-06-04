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

  const validate = () => {
    const newErrors = {};
    if(!user.username) {
      newErrors.username = 'Username does not match the required format.';
    }
    if(!user.phoneNumber) {
      newErrors.phoneNumber = "Phone number must start with 0, contain only digits 0-9, and be exactly 10 digits long."
    }

    if(!user.email) {
      newErrors.email = 'Email does not match the required format.';
    }
    if (!user.password) {
      newErrors.password = 'Password must be 8-30 characters long and include at least one letter (A-Z)';
    }
    
    if(!user.firstName) {
      newErrors.firstName =  "First and last names must be 1-30 characters long and contain only letters (A-Z or a-z)."
    };
    if(!user.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    if(user.isBlocked) { 
      newErrors.isBlocked = "Your account has been blocked. Please contact the administrator."
    };
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    const { username, phoneNumber, email, password, firstName, lastName } =
      user;
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
    if (!/^0\d{9}$/.test(phoneNumber)) {
      return alert(
        "Phone number must start with 0, contain only digits 0-9, and be exactly 10 digits long."
      );
    }
    try {
      await register({
        username,
        phoneNumber,
        email,
        password,
        firstName,
        lastName,
      });
      setSuccessMessage("Registration successful! Please login.");
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
                <input
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={updateUser("username")}
                />
                {error.username && <div className="error">{error.username}</div>}
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
                <input
                  type="text"
                  placeholder="First Name"
                  value={user.firstName}
                  onChange={updateUser("firstName")}
                />
                {error.firstName && <div className="error">{error.firstName}</div>}

                <input
                  type="text"
                  placeholder="Last Name"
                  value={user.lastName}
                  onChange={updateUser("lastName")}
                />
                {error.lastName && <div className="error">{error.lastName}</div>}

              </>
            )}
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={updateUser("email")}
            />
            {error.email && <div className="error">{error.email}</div>}
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={updateUser("password")}
            />
            {successMessage && <div className="success">{successMessage}</div>}

            {error.password && <div className="error">{error.password}</div>}
            <button type="submit">
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Authentication;
