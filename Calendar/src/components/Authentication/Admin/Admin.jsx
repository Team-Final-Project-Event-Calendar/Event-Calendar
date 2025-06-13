import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import styles from "./Admin.module.css";
import { io } from "socket.io-client";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

function Admin() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchEvents, setSearchEvents] = useState([]);
  const [findEvents, setFindEvents] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [eventData, setEventData] = useState({ title: "", description: "" });

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


  useEffect(() => {
    fetch(`${key}/api/auth/delete-requests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setDeleteRequests(data))
      .catch(err => console.error(err));
  }, []);

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
        if (!response.ok) throw new Error("Failed to fetch events");
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
      .then(res => res.json())
      .then(data => {
        setAllUsers(Array.isArray(data) ? data : data.users || []);
      })
      .catch(err => console.error("Failed to fetch users", err));
  }, []);

  const filteredUsers = allUsers.filter((user) =>
    [user.firstName, user.email, user.username, user.lastName].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

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
        alert("Failed to delete event: " + error.message);
      }
    } catch (error) {
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
      const res = await fetch(`${key}/api/events/${editingEventId}`, {
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

  const handleApprove = async (userId) => {
    const res = await fetch(`${key}/api/auth/delete/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      setDeleteRequests((prev) =>
        prev.filter((r) => r.userId && r.userId._id !== userId)
      );
      
      setAllUsers((prev) => prev.filter((u) => u._id !== userId));
    }
  };

  const filteredEvents = searchEvents.filter((event) =>
    [event.title, event.description].some((field) =>
      field.toLowerCase().includes(findEvents.toLowerCase())
    )
  );

  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.adminTitle}>Administration Hub</h2>

      <section className={styles.panel}>
        <h3 className={styles.panelTitle}>Deletion Requests</h3>
        {deleteRequests.length === 0 ? (
          <p className={styles.emptyMessage}>No pending requests</p>
        ) : (
          deleteRequests.map(req => (
            <div key={req._id} className={styles.requestCard}>
              <p>
                {req.userId 
                  ? `${req.userId.username} (${req.userId.email}) requested deletion.` 
                  : "Unknown user requested deletion."
                }
              </p>
              {req.userId && (
                <button
                  onClick={() => handleApprove(req.userId._id)}
                  className={styles.deleteButton}
                >
                  Delete User
                </button>
              )}
            </div>
          ))
        )}
      </section>

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
                    className={u.isBlocked ? styles.btnUnblock : styles.btnBlock}
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
          <ul className={styles.eventList}>
            {filteredEvents.map((event) => (
              <li key={event._id} className={styles.eventListItem}>
                {editingEventId === event._id ? (
                  <>
                    <div className={styles.eventInfo}>
                      <input
                        value={eventData.title}
                        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                        className={styles.editInput}
                      />
                      <textarea
                        value={eventData.description}
                        onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                        className={styles.editTextarea}
                      />
                    </div>
                    <div className={styles.eventAction}>
                      <button onClick={saveEdit} className={styles.saveButton}>Save</button>
                      <button onClick={cancelEditing} className={styles.cancelButton}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.eventInfo}>
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                    <div className={styles.eventAction}>
                      <button onClick={() => startEditingEvent(event)} className={styles.editButton}>Edit</button>
                      <button onClick={() => deleteEvent(event._id)} className={styles.deleteButton}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );

}

export default Admin;
