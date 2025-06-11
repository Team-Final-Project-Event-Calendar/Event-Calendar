import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";
const DEFAULT_AVATAR =
  "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg";

function Contacts() {
  const navigate = useNavigate();
  const DEFAULT_AVATAR =
    "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg";

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${key}/api/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContacts(response.data);
      } catch (err) {
        console.error("Error fetching contacts:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchContacts();
    }
  }, [token]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="w-60" style={{ margin: "0px auto" }}>
      <div
        style={{
          maxWidth: "400px",
          minWidth: "300px",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            marginBottom: "16px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "8px",
          }}
        >
          Contacts
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {contacts.map((user) => (
            <li
              onClick={() => navigate(`/users/${user._id}`)}
              key={user._id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 8px",
                borderRadius: "6px",
                marginBottom: "8px",
                transition: "background 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <img
                src={user.avatar}
                alt={user.username}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "12px",
                }}
                onError={(e) => {
                  e.target.onerror = null; // prevent infinite loop
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
              <span style={{ fontSize: "1rem", fontWeight: "500" }}>
                {user.username}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="search-area"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100vw",
        }}
      >
        <div className="search-bar">
          <div className="search-bar-area">
            <input
              type="text"
              placeholder="Type username to find user"
              style={{ color: "white", background: "#5565dd" }}
            />
            <Button variant={"ghost"} style={{ color: "grey" }}>
              Find
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
