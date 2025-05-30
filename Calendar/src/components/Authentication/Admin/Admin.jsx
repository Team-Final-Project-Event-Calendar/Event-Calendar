import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import styles from "./Admin.module.css";

function Admin() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched users:", data);
        // Adjust this based on the actual API response structure
        setAllUsers(Array.isArray(data) ? data : data.users || []);
      })
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  const filteredUsers = allUsers.filter((user) =>
    [user.firstName, user.email, user.username, user.lastName].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const toggleBlock = async (id, block) => {
    const endpoint = `http://localhost:5000/api/auth/${block ? "block" : "unblock"}/${id}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) {
      setAllUsers((users) =>
        users.map((u) => (u._id === id ? { ...u, isBlocked: block } : u))
      );
    }
  };

  const deleteUser = async (id) => {
    const res = await fetch(`http://localhost:5000/api/auth/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) {
      setAllUsers((users) => users.filter((u) => u._id !== id));
    } else {
      const error = await res.json();
      console.error("Failed to delete user:", error.message);
      alert("Failed to delete user: " + error.message);
    }
  };

  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.adminTitle}>Administration Hub</h2>

      <input
        type="text"
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      <ul className={styles.userList}>
        {filteredUsers.map((u) => (
          <li key={u._id} className={styles.userListItem}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{u.firstName}</span>
              <span className={styles.userEmail}>({u.email})</span>
            </div>

            <div className={styles.userAction}>
              <button
                className={u.isBlocked ? styles.btnUnblock : styles.btnBlock}
                onClick={() => toggleBlock(u._id, !u.isBlocked)}
              >
                {u.isBlocked ? "Unblock" : "Block"}
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => deleteUser(u._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => (window.location.href = "/")}
        className={styles.backButton}
      >
        Back to Home
      </button>
    </div>
  );
}

export default Admin;