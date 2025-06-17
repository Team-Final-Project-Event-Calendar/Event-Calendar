import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { Button } from "@chakra-ui/react";
const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";
import { ToastContainer, toast } from "react-toastify";

const CreateContactsListForm = ({ onListCreated }) => {
  const { user, token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [success, setSuccess] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState("");
  const [currentList, setCurrentList] = useState([]);
  const [isVisible, setIsvisible] = useState(false);

  const addUser = (username, id) => {
    if (currentList.find((u) => u.id === id)) {
      toast.error("User already added");
      return;
    }

    setCurrentList((prev) => [...prev, { username, id }]);
  };

  const removeUser = (id) => {
    const removedUser = currentList.find((u) => u.id === id);
    if (removedUser) {
      setCurrentList((prev) => prev.filter((u) => u.id !== id));
    }
  };

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${key}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(response.data);
      } catch (err) {
        console.error("Error fetching contacts:", err.response?.data || err);
      }
    };
    if (token) fetchAllUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?._id) {
      setError("User not authenticated");
      return;
    }

    const contactIds = currentList.map((u) => u.id);

    if (!title) {
      toast.error("Please add title first");
      return;
    }
    if (currentList.length < 1) {
      toast.error("Add at least one user to the list");
      return;
    }

    try {
      const res = await axios.post(
        `${key}/api/contacts`,
        {
          title,
          creator: user._id,
          contacts: contactIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setError("");
      setTitle("");
      setCurrentList([]);

      // Call the callback to refresh the lists
      if (onListCreated) {
        onListCreated();
      }

      toast.success(`${currentList.title} has been created`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create list.");
      setSuccess(false);
    }
  };

  return (
    <div className="createcontactlist-primary-container"
      style={{
        maxWidth: "300px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "var(--bg-color)",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <h2
          className="create-form-container"
          onClick={() => setIsvisible(!isVisible)}
          style={{
            fontSize: "1.3rem",
            fontWeight: "bold",
            textAlign: "center",
            color: "var(--text-color)",
          }}
        >
          Create a Contacts List
        </h2>
        {isVisible === true ? (
          <div onClick={() => setIsvisible(false)}>
            <FaMinus />
          </div>
        ) : (
          <div onClick={() => setIsvisible(true)}>
            <FaPlus></FaPlus>
          </div>
        )}
      </div>

      {isVisible === true ? (
        <div>
          {error && (
            <p style={{ color: "red", textAlign: "center" }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "green", textAlign: "center" }}>
              List created successfully!
            </p>
          )}

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="title"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "var(--label-color)",
              }}
            >
              List Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Gym Buddies"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                outline: "none",
                transition: "border-color 0.3s",
              }}
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}
          >
            {/* All Users */}
            <div
              style={{
                backgroundColor: "var(--all-users-bg-color)",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "var(--all-users-text-color)",
                }}
              >
                All Users
              </h3>
              <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                {allUsers.map(
                  (u) =>
                    u._id !== user._id && (
                      <div
                        key={u._id}
                        onClick={() => addUser(u.username, u._id)}
                        style={{
                          cursor: "pointer",
                          padding: "8px",
                          backgroundColor: "var(--user-bg-color)",
                          borderRadius: "4px",
                          marginBottom: "4px",
                          border: "1px solid var(--user-border-color)",
                          transition: "background-color 0.3s",
                        }}
                      >
                        {u.username}
                      </div>
                    )
                )}
                {allUsers.length === 0 && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--no-users-text-color)",
                      fontStyle: "italic",
                    }}
                  >
                    No users available
                  </p>
                )}
              </div>
            </div>

            {/* Selected Users */}
            <div
              style={{
                backgroundColor: "var(--selected-users-bg-color)",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "var(--selected-users-text-color)",
                }}
              >
                Selected Users
              </h3>
              <div style={{ maxHeight: "240px", overflowY: "auto" }}>
                {currentList.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => removeUser(u.id)}
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                      backgroundColor: "var(--user-bg-color)",
                      borderRadius: "4px",
                      marginBottom: "4px",
                      border: "1px solid var(--user-border-color)",
                      transition: "background-color 0.3s",
                    }}
                  >
                    {u.username}{" "}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--remove-user-text-color)",
                      }}
                    >
                      (click to remove)
                    </span>
                  </div>
                ))}
                {currentList.length === 0 && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--no-users-text-color)",
                      fontStyle: "italic",
                    }}
                  >
                    No users selected
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                fontWeight: "600",
                backgroundColor: "#5565dd",
                marginBottom: "20px",
                transition: "background-color 0.3s",
              }}
            >
              Create List
            </button>
            <Button
              onClick={() => setCurrentList([])}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "4px",
                fontWeight: "600",
                transition: "background-color 0.3s",
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      ) : null}
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default CreateContactsListForm;
