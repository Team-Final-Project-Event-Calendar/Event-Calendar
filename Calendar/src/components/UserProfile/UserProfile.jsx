import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";

const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg";

function UserProfile() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

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

  if (!userData) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <p style={{ fontSize: "1.2rem", color: "#666" }}>Loading user...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <img
          src={userData.avatar || DEFAULT_AVATAR}
          alt={userData.username}
          style={{
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "20px",
            border: "4px solid #e0e0e0",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_AVATAR;
          }}
        />

        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "600",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          {userData.username}
        </h2>

        <div style={{ textAlign: "left", padding: "0 20px" }}>
          <p style={{ fontSize: "1rem", marginBottom: "12px" }}>
            <strong>Email:</strong> {userData.email}
          </p>
          <p style={{ fontSize: "1rem", marginBottom: "12px" }}>
            <strong>Phone:</strong> {userData.phoneNumber || "N/A"}
          </p>
          {/* Additional fields if needed */}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
