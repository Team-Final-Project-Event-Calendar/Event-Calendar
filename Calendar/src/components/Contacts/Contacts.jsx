import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { ButtonGroup, Box, Stack, Text } from "@chakra-ui/react";
import CreateContactsListForm from "../CreateContactsListForm/CreateContactsListForm";
import CardsListComponent from "../CardsListComponent/CardsListComponent";
import { useRef } from "react";
import "./Contacts.css";

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
  const [currentView, setCurrentView] = useState("");
  const [contactLists, setContactLists] = useState([]);
  const [blured, setBlured] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [events, setEvents] = useState([]);
  const invitePopupRef = useRef(null);
  const [feedback, setFeedback] = useState("");
  const [selectedUsername, setSelectedUsername] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${key}/api/events/mine`, {
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
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSendInvite = async (event) => {
    if (!selectedUsername) {
      setFeedback("Please select a username");
      return;
    }
    if (!event._id) {
      setFeedback("No ID found");
      return;
    }

    try {
      const response = await axios.post(
        `${key}/api/events/${event._id}/participants`,
        { username: selectedUsername },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFeedback(
        response.data.message || `Invite sent to ${selectedUsername}!`
      );
      alert(`Invite has been send to user ${user.username}`);
      setSelectedUsername("");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send invite";
      setFeedback(msg);
      console.error(error);
    }
  };

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

  const fetchAllContactsList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${key}/api/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Contact list repspone:", response.data);
      setContactLists(response.data);
    } catch (error) {
      console.error(
        "Error fetching contacts list:",
        error.response?.data || error.message
      );
      setContactLists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLIst = async (id) => {
    console.log(id);

    try {
      const res = await fetch(`${key}/api/contacts/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setContactLists((prevLists) =>
          prevLists.filter((list) => list._id !== id)
        );
        alert("Contact list deleted successfully");
      } else {
        const errorData = await res.json();
        alert(`Failed to delete: ${errorData.message}`);
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        invitePopupRef.current &&
        !invitePopupRef.current.contains(event.target)
      ) {
        setIsInviting(false);
        setBlured(false);
      }
    };

    if (isInviting) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isInviting]);

  useEffect(() => {
    if (token) {
      fetchAllUsers();
      fetchAllContactsList();
      fetchEvents();
    }
  }, [token]);

  const handleContactListCreated = () => {
    fetchAllContactsList();
  };

  const setInvite = async (contact) => {
    setSelectedUsername(contact.username);
    setBlured(true);
    setIsInviting(true);
  };

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

  // Helper function to format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      {isInviting && (
        <div className="invite-form ">
          {isInviting && (
            <div
              ref={invitePopupRef}
              className="pop-up "
              style={{
                position: "fixed",
                zIndex: "1000",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                width: "500px",
                maxHeight: "80vh",
                overflowY: "auto",
                padding: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <h2
                  style={{
                    textAlign: "center",
                    marginBottom: "16px",
                    fontWeight: "700",
                  }}
                >
                  Invite to Event
                </h2>
                <h3 style={{ color: "grey", marginBottom: "20px" }}>
                  Click on the Event to Invite
                </h3>
              </div>
              {events.map((e, index) => (
                <div
                  onClick={() => handleSendInvite(e)}
                  className="event-block"
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "12px",
                  }}
                >
                  <h3 style={{ margin: "0 0 6px" }}>{e.title}</h3>
                  <p style={{ margin: "0 0 6px", color: "#666" }}>
                    {e.description}
                  </p>
                  <p style={{ margin: "0 0 4px", fontSize: "14px" }}>
                    <strong>{`Start: ${formatDate(e.startDateTime)}`}</strong>
                  </p>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    <strong>{`End: ${formatDate(e.endDateTime)}`}</strong>{" "}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        className={blured ? "blured" : ""}
        style={{
          width: "60vw",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        {/* Left: All users */}
        <div
          className="all-contacts"
          style={{
            width: "250px",
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
                    (e.currentTarget.style.backgroundColor = "#5565dd")
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

        {/* Center: Toggle View */}
        <div
          style={{
            flexGrow: 1,
            maxWidth: "100%",
            padding: "20px",
            borderRadius: "10px",
            minHeight: "150px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* View Toggle Buttons */}
          <Box mb={4} textAlign="center">
            <ButtonGroup isAttached variant="outline" size="sm">
              <Button
                colorScheme={currentView === "search" ? "blue" : "gray"}
                onClick={() => setCurrentView("search")}
              >
                Find Users
              </Button>
              <Button
                colorScheme={currentView === "lists" ? "blue" : "gray"}
                onClick={() => setCurrentView("lists")}
              >
                Contact Lists
              </Button>
            </ButtonGroup>
          </Box>

          {currentView === "search" && (
            <div
              style={{
                paddingTop: "20px",
                alignSelf: "center",
                width: "300px",
              }}
            >
              <Stack spacing={4}>
                <input
                  type="text"
                  value={searchQuery}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearchQuery(e.target.value);
                      handleSearch();
                    }
                  }}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentView("search");
                  }}
                  placeholder="Search"
                  style={{
                    background: "#5565dd",
                    borderRadius: "5px",
                    padding: "8px",
                    color: "white",
                    border: "none",
                  }}
                />
                <Button
                  variant={"solid"}
                  colorScheme="blue"
                  onClick={handleSearch}
                >
                  Find
                </Button>

                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid #ccc",
                    margin: "16px 0",
                  }}
                />
              </Stack>
            </div>
          )}
          {/* Conditional Display */}
          {currentView === "search" ? (
            searchedUsers.length > 0 ? (
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
              <Text color="gray.500">
                Search for a user to see their profile.
              </Text>
            )
          ) : (
            <Box>
              <Text fontWeight="bold" fontSize="lg" mb={3}>
                Your Contact Lists:
              </Text>

              {contactLists.length > 0 ? (
                <div>
                  {contactLists.map((list) => (
                    <div
                      className="contact-container"
                      key={list._id}
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "12px",
                        background: "#f8f9fa",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h3
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            marginBottom: "8px",
                            color: "#2c5282",
                          }}
                        >
                          {list.title}
                        </h3>
                        <Button
                          padding="0px 10px"
                          backgroundColor={"red"}
                          onClick={() => handleDeleteLIst(list._id)}
                        >
                          Delete List
                        </Button>
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#4a5568" }}>
                        <p>{list.contacts.length} contacts</p>
                      </div>
                      <div
                        style={{
                          marginTop: "8px",
                          maxHeight: "120px",
                          overflowY: "auto",
                          padding: "8px",
                          background: "#fff",
                          borderRadius: "4px",
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        {list.contacts.map((contact) => (
                          <div
                            onClick={() => console.log(contact)}
                            key={contact._id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "4px 0",
                              borderBottom: "1px solid #f0f0f0",
                            }}
                          >
                            <img
                              src={contact.avatar || DEFAULT_AVATAR}
                              alt={contact.username}
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                marginRight: "8px",
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_AVATAR;
                              }}
                            />
                            <span>{contact.username}</span>
                            <Button
                              onClick={() => setInvite(contact)}
                              padding={"0px 10px"}
                              variant={"ghost"}
                              marginLeft={"10px"}
                            >
                              Invite
                            </Button>
                            <Button
                              marginLeft={"auto"}
                              variant={"ghost"}
                              color={"red"}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Text color="gray.500">
                  You haven't created any contact lists yet.
                </Text>
              )}
            </Box>
          )}
        </div>

        <CreateContactsListForm onListCreated={handleContactListCreated} />
      </div>
    </div>
  );
}

export default Contacts;
