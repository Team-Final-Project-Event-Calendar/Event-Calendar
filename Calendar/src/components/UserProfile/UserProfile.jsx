import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";

const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACK_END_URL || "http://localhost:5000"
          }/api/auth/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err);
      }
    };

    if (id && token) {
      fetchUser();
    }
  }, [id, token]);

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!userData) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>Loading user...</p>
      </div>
    );
  }

  const bgColor = darkMode ? "#1e1e1e" : "#f4f6f9";
  const cardColor = darkMode ? "#2c2c2c" : "#ffffff";
  const textColor = darkMode ? "#f1f1f1" : "#333";
  const subTextColor = darkMode ? "#ccc" : "#555";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "60px 20px",
        background: bgColor,
        minHeight: "100vh",
        transition: "background 0.3s ease",
      }}
    >
      <div
        style={{
          backgroundColor: cardColor,
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          maxWidth: "500px",
          width: "100%",
          padding: "40px 30px",
          textAlign: "center",
          color: textColor,
          transition: "background 0.3s ease, color 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              border: "none",
              color: subTextColor,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: darkMode ? "#444" : "#ddd",
              color: darkMode ? "#fff" : "#333",
              border: "none",
              borderRadius: "12px",
              padding: "4px 12px",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <img
          src={userData.avatar || DEFAULT_AVATAR}
          alt={userData.username}
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            objectFit: "cover",
            border: `5px solid ${darkMode ? "#555" : "#e0e0e0"}`,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_AVATAR;
          }}
        />

        {/* Username */}
        <h2
          style={{ fontSize: "1.8rem", fontWeight: "600", marginBottom: "8px" }}
        >
          {userData.username}
        </h2>

        <hr
          style={{
            margin: "20px 0",
            border: "none",
            borderTop: "1px solid #ddd",
          }}
        />

        <div
          style={{
            textAlign: "left",
            fontSize: "1rem",
            lineHeight: "1.6",
          }}
        >
          <div style={{ marginBottom: "12px", color: subTextColor }}>
            <strong>Email:</strong> {userData.email}
          </div>
          <div style={{ marginBottom: "12px", color: subTextColor }}>
            <strong>Phone:</strong> {userData.phoneNumber || "N/A"}
          </div>
          <div style={{ marginBottom: "12px", color: subTextColor }}>
            <strong>Joined:</strong> {userData.role.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
