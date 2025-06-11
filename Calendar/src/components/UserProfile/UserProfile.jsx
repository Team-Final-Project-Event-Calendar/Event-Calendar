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

  if (!userData) return <p>Loading user...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>{userData.username}'s Profile</h2>
      <img
        src={userData.avatar || DEFAULT_AVATAR}
        alt={userData.username}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = DEFAULT_AVATAR;
        }}
      />
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Phone:</strong> {userData.phoneNumber || "N/A"}
      </p>
      {/* Add more user fields here */}
    </div>
  );
}

export default UserProfile;
