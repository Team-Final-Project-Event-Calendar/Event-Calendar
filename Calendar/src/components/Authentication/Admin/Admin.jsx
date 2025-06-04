import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import styles from "./Admin.module.css";
const key = import.meta.env.VITE_API_URL || "http://localhost:5000";
function Admin() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchEvents, setSearchEvents] = useState([]);
  const [findEvents, setFindEvents] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventData, setEventData] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${key}/api/events/admin`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setSearchEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    fetch(`${key}/api/auth/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
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
    const endpoint = `${key}/api/auth/${
      block ? "block" : "unblock"
    }/${id}`;
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
      console.error("Failed to delete user:", error.message);
      alert("Failed to delete user: " + error.message);
    }
  };

  const filteredEvents = searchEvents.filter((event) => {
    return (
      event.title.toLowerCase().includes(findEvents.toLowerCase()) ||
      event.description.toLowerCase().includes(findEvents.toLowerCase())
    );
  });

  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${key}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setSearchEvents((events) => events.filter((e) => e._id !== id));
      } else {
        const error = await res.json();
        console.error("Failed to delete event:", error.message);
        alert("Failed to delete event: " + error.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  };

  const startEditingEvent = (event) => {
    setEditingEventId(event._id);
    setEventData({ title: event.title, description: event.description });
  };

  const cancelEditing = () => {
    setEditingEventId(null);
    setEventData({ title: "", description: "" });
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(
        `${key}/api/events/${editingEventId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(eventData),
        }
      );
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

  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className={styles.adminContainer}
      style={{
        width: "60vw",
        maxWidth: "100%",
        margin: "0 auto",
        padding: "1rem",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <h2
        className={styles.adminTitle}
        style={{
          textAlign: "center",
          fontSize: "2rem",
          marginBottom: "1rem",
        }}
      >
        Administration Hub
      </h2>

      <div
        className="sections-container"
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: "2rem",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <section
          className={styles.panel}
          style={{ flex: "1 1 45%", minWidth: "300px" }}
        >
          <h3 className={styles.panelTitle}>Users</h3>
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            style={{
              width: "100%",
              padding: "0.5rem",
              boxSizing: "border-box",
            }}
          />
          <ul style={{ padding: "10px 20px" }} className={styles.userList}>
            {filteredUsers.map((u) => (
              <li
                key={u._id}
                className={styles.userListItem}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  marginBottom: "1rem",
                }}
              >
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
                    className={styles.deleteButton}
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          className={styles.panel}
          style={{ flex: "1 1 45%", minWidth: "300px" }}
        >
          <h3 className={styles.panelTitle}>Events</h3>
          <input
            type="text"
            placeholder="Search events by title"
            value={findEvents}
            onChange={(e) => setFindEvents(e.target.value)}
            className={styles.searchInput}
            style={{
              width: "100%",
              padding: "0.5rem",
              boxSizing: "border-box",
            }}
          />
          <ul style={{ padding: "10px 20px" }} className={styles.eventList}>
            {filteredEvents.map((event) => (
              <li
                key={event._id}
                className={styles.eventListItem}
                style={{ marginBottom: "1rem" }}
              >
                {editingEventId === event._id ? (
                  <>
                    <input
                      type="text"
                      value={eventData.title}
                      onChange={(e) =>
                        setEventData({ ...eventData, title: e.target.value })
                      }
                      className={styles.editInput}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <textarea
                      value={eventData.description}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          description: e.target.value,
                        })
                      }
                      className={styles.editTextarea}
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <div className={styles.eventAction}>
                      <button className={styles.saveButton} onClick={saveEdit}>
                        Save
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.eventInfo}>
                      <strong>{event.title}</strong> - {event.description}
                    </div>
                    <div className={styles.eventAction}>
                      <button
                        className={styles.editButton}
                        onClick={() => startEditingEvent(event)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => deleteEvent(event._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        className={styles.backButton}
        style={{ marginTop: "2rem", padding: "0.5rem 1rem", fontSize: "1rem" }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default Admin;
