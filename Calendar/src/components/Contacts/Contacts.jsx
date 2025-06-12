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
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const { user, token } = useContext(AuthContext);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${key}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(response.data);
    } catch (err) {
      console.error("Error fetching contacts:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllUsers();
  }, [token]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchedUsers([]); // Reset result view
      return;
    }

    try {
      const res = await axios.get(
        `${key}/api/auth/users/search/${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const matchedUsers = res.data.data || [];
      setSearchedUsers(matchedUsers);
    } catch (err) {
      console.error("Search failed:", err.response?.data || err);
      setSearchedUsers([]);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "60vw",
        margin: "0px auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "20px",
        gap: "20px",
      }}
    >
      {/* Left: Contacts List */}
      <div
        style={{
          width: "300px",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          padding: "20px",
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
          {contacts.length === 0 ? (
            <li style={{ textAlign: "center", padding: "10px" }}>
              No users found.
            </li>
          ) : (
            contacts.map((user) => (
              <li
                key={user._id}
                onClick={() => navigate(`/users/${user._id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 8px",
                  borderRadius: "6px",
                  marginBottom: "8px",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <img
                  src={user.avatar || DEFAULT_AVATAR}
                  alt={user.username}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "12px",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
                <span style={{ fontSize: "1rem", fontWeight: "500" }}>
                  {user.username}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Center: Searched Users */}
      <div
        style={{
          flexGrow: 1,
          maxWidth: "600px",
          backgroundColor: "#fdfdfd",
          padding: "20px",
          borderRadius: "10px",
          boxShadow:
            searchedUsers.length > 0 ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
          minHeight: "150px",
        }}
      >
        {searchedUsers.length > 0 ? (
          <div>
            <h3 style={{ marginBottom: "16px", fontSize: "1.2rem" }}>
              Found {searchedUsers.length} user(s):
            </h3>
            {searchedUsers.map((user) => (
              <div
                onClick={() => navigate(`/users/${user._id}`)}
                key={user._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  paddingBottom: "15px",
                  marginBottom: "15px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <img
                  src={user.avatar || DEFAULT_AVATAR}
                  alt={user.username}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
                <div>
                  <h4 style={{ marginBottom: "5px", fontSize: "1.1rem" }}>
                    {user.username}
                  </h4>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phoneNumber}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#999" }}>
            Search for a user to see their profile.
          </p>
        )}
      </div>

      {/* Right: Search Bar */}
      <div style={{ minWidth: "220px", paddingTop: "20px" }}>
        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            style={{
              background: "#5565dd",
              borderRadius: "5px",
              padding: "8px",
              color: "white",
              border: "none",
            }}
          />
          <Button variant={"solid"} colorScheme="blue" onClick={handleSearch}>
            Find
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
