import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import styles from "./Admin.module.css";
import { io } from "socket.io-client";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

/**
 * Admin component provides an administration hub interface
 * for managing users, events, and deletion requests.
 * It supports searching, pagination, editing, blocking/unblocking users,
 * and real-time updates via Socket.IO.
 *
 * @component
 * @returns {JSX.Element} The admin dashboard UI or redirects if unauthorized.
 */
function Admin() {
  const { isLoggedIn, user } = useContext(AuthContext);

  /** @type {[string, function]} Search term for filtering users */
  const [search, setSearch] = useState("");

  /** @type {[Array<Object>, function]} List of all users */
  const [allUsers, setAllUsers] = useState([]);

  /** @type {[Array<Object>, function]} List of events for admin search */
  const [searchEvents, setSearchEvents] = useState([]);

  /** @type {[string, function]} Search term for filtering events */
  const [findEvents, setFindEvents] = useState("");

  /** @type {[string|null, function]} ID of the event currently being edited */
  const [editingEventId, setEditingEventId] = useState(null);

  /** @type {[Array<Object>, function]} List of deletion requests */
  const [deleteRequests, setDeleteRequests] = useState([]);

  /** 
   * @type {[Object, function]} Event data object for editing with fields:
   *  - title {string}
   *  - description {string}
   */
  const [eventData, setEventData] = useState({ title: "", description: "" });

  /** @type {[number, function]} Current page number for users pagination */
  const [currentPageUsers, setCurrentPageUsers] = useState(1);

  /** @type {[number, function]} Total pages for users pagination */
  const [totalPagesUsers, setTotalPagesUsers] = useState(1);

  /** @type {[number, function]} Current page number for events pagination */
  const [currentPageEvents, setCurrentPageEvents] = useState(1);

  /** @type {[number, function]} Total pages for events pagination */
  const [totalPagesEvents, setTotalPagesEvents] = useState(1);

  // Initialize Socket.IO connection on mount
  useEffect(() => {
    const socket = io(key, {
      withCredentials: true,
      query: {
        token: localStorage.getItem("token"),
      },
    });

    socket.on("connect", () => {
      console.log("Connected with socket id:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch deletion requests on mount
  useEffect(() => {
    fetch(`${key}/api/auth/delete-requests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDeleteRequests(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch admin events when currentPageEvents or findEvents changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `${key}/api/events/admin?page=${currentPageEvents}&limit=5&search=${findEvents}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        setSearchEvents(data.events || []);
        setTotalPagesEvents(data.totalPages || 1);
      } catch (err) {
        console.error("Error loading admin events", err);
      }
    };

    fetchEvents();
  }, [currentPageEvents, findEvents]);

  // Fetch users for admin when currentPageUsers changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found");
      return;
    }

    fetch(`${key}/api/auth/users/admin?page=${currentPageUsers}&limit=10`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAllUsers(data.users || []);
        setTotalPagesUsers(data.totalPages || 1);
      })
      .catch((err) => console.error("Failed to fetch users", err));
  }, [currentPageUsers]);

  /**
   * Filter users by search term matching
   * firstName, email, username, or lastName fields.
   */
  const filteredUsers = allUsers.filter((user) =>
    [user.firstName, user.email, user.username, user.lastName].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  /**
   * Block or unblock a user by ID.
   *
   * @param {string} id - User ID
   * @param {boolean} block - Whether to block (true) or unblock (false)
   */
  const toggleBlock = async (id, block) => {
    const endpoint = `${key}/api/auth/${block ? "block" : "unblock"}/${id}`;
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

  /**
   * Delete a user by ID.
   *
   * @param {string} id - User ID
   */
  const deleteUser = async (id) => {
    const res = await fetch(`${key}/api/auth/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) {
      setAllUsers((users) => users.filter((u) => u._id !== id));
    } else {
      const error = await res.json();
      alert("Failed to delete user: " + error.message);
    }
  };

  /**
   * Delete an event by ID.
   *
   * @param {string} id - Event ID
   */
  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${key}/api/events/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setSearchEvents((events) => events.filter((e) => e._id !== id));
      } else {
        const error = await res.json();
        alert("Failed to delete event: " + error.message);
      }
    } catch (error) {
      alert("An error occurred while deleting the event.");
    }
  };

  /**
   * Start editing an event by setting its ID and data to state.
   *
   * @param {Object} event - Event object to edit
   */
  const startEditingEvent = (event) => {
    setEditingEventId(event._id);
    setEventData({ title: event.title, description: event.description });
  };

  /**
   * Cancel editing an event and reset editing state.
   */
  const cancelEditing = () => {
    setEditingEventId(null);
    setEventData({ title: "", description: "" });
  };

  /**
   * Save edited event data via PUT request.
   */
  const saveEdit = async () => {
    try {
      const res = await fetch(`${key}/api/events/admin/${editingEventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(eventData),
      });
      if (res.ok) {
        const updatedEvent = await res.json();
        setSearchEvents((events) =>
          events.map((e) => (e._id === editingEventId ? updatedEvent : e))
        );
        cancelEditing();
      } else {
        const error = await res.json();
        alert("Failed to update event: " + error.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Filter events by search term matching title or description.
   */
  const filteredEvents = searchEvents.filter((event) =>
    [event.title, event.description].some((field) =>
      field.toLowerCase().includes(findEvents.toLowerCase())
    )
  );

  // Redirect if user is not logged in or not admin
  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.adminTitle}>Administration Hub</h2>

      <div className={styles.sectionsContainer}>
        <section className={styles.panel}>
          <h3 className={styles.panelTitle}>Users</h3>
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
                    className={
                      u.isBlocked ? styles.btnUnblock : styles.btnBlock
                    }
                    onClick={() => toggleBlock(u._id, !u.isBlocked)}
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.paginationControls}>
            <button
              onClick={() => setCurrentPageUsers((p) => Math.max(p - 1, 1))}
              disabled={currentPageUsers === 1}
              className={styles.pageButton}
            >
              Prev
            </button>
            <span className={styles.pageInfo}>
              Page {currentPageUsers} of {totalPagesUsers}
            </span>
            <button
              onClick={() =>
                setCurrentPageUsers((p) => Math.min(p + 1, totalPagesUsers))
              }
              disabled={currentPageUsers === totalPagesUsers}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </section>

        <section className={styles.panel}>
          <h3 className={styles.panelTitle}>Events</h3>
          <input
            type="text"
            placeholder="Search events by title or description"
            value={findEvents}
            onChange={(e) => setFindEvents(e.target.value)}
            className={styles.searchInput}
          />

          <ul className={styles.eventsList}>
            {filteredEvents.map((event) => (
              <li key={event._id} className={styles.eventItem}>
                {editingEventId === event._id ? (
                  <>
                    <input
                      type="text"
                      value={eventData.title}
                      onChange={(e) =>
                        setEventData((data) => ({
                          ...data,
                          title: e.target.value,
                        }))
                      }
                      className={styles.editInput}
                    />
                    <textarea
                      value={eventData.description}
                      onChange={(e) =>
                        setEventData((data) => ({
                          ...data,
                          description: e.target.value,
                        }))
                      }
                      className={styles.editTextArea}
                    />
                    <div className={styles.editButtons}>
                      <button onClick={saveEdit} className={styles.saveButton}>
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4>{event.title}</h4>
                    <p>{event.description}</p>
                    <div className={styles.eventActions}>
                      <button
                        onClick={() => startEditingEvent(event)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(event._id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          <div className={styles.paginationControls}>
            <button
              onClick={() => setCurrentPageEvents((p) => Math.max(p - 1, 1))}
              disabled={currentPageEvents === 1}
              className={styles.pageButton}
            >
              Prev
            </button>
            <span className={styles.pageInfo}>
              Page {currentPageEvents} of {totalPagesEvents}
            </span>
            <button
              onClick={() =>
                setCurrentPageEvents((p) => Math.min(p + 1, totalPagesEvents))
              }
              disabled={currentPageEvents === totalPagesEvents}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </section>
        <section className={styles.panel}>
          <h3 className={styles.panelTitle}>Deletion Requests</h3>
          {deleteRequests.length === 0 ? (
            <p className={styles.emptyMessage}>No pending requests</p>
          ) : (
            deleteRequests.map((req) => (
              <div
                key={req._id}
                style={{
                  padding: "16px",
                  marginBottom: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "16px",
                    color: "#333",
                  }}
                >
                  {req.userId
                    ? `${req.userId.username} (${req.userId.email}) requested deletion.`
                    : "Unknown user requested deletion."}
                </p>

                {req.userId && (
                  <button
                    onClick={() => handleApprove(req.userId._id)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "#c0392b")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e74c3c")
                    }
                  >
                    Delete User
                  </button>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default Admin;
