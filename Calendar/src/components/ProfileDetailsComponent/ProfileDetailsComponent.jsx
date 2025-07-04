/**
 * @file ProfileDetailsComponent.jsx
 * @description A React component that displays and allows editing of the user's profile details. 
 * It includes functionality for updating the profile and sending account deletion requests.
 */

import React, { useContext, useState } from "react";
import { Button } from "@chakra-ui/react";
import { AuthContext } from "../../components/Authentication/AuthContext";
import { Avatar, Code, Stack, useAvatar } from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

/**
 * @function ProfileDetailsComponent
 * @description Displays the user's profile details and provides functionality to update the profile or request account deletion.
 * @returns {JSX.Element} The rendered ProfileDetailsComponent.
 */
function ProfileDetailsComponent() {
  const { user, setUser } = useContext(AuthContext);

  /**
   * @constant {string} message
   * @description A message displayed to the user for feedback.
   */
  const [message, setMessage] = useState("");

  /**
   * @constant {string} error
   * @description An error message displayed to the user if an operation fails.
   */
  const [error, setError] = useState("");

  /**
   * @constant {Object} formData
   * @description The form data for the user's profile, initialized with the current user's data.
   */
  const [formData, setFormData] = useState(user || {});

  /**
   * @function handleChange
   * @description Updates the form data when a field value changes.
   * @param {string} key - The key of the field to update.
   * @param {any} value - The new value for the field.
   */
  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  /**
   * @function onSubmit
   * @description Handles the form submission to update the user's profile.
   * @param {Object} e - The form submission event.
   * @async
   */
  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phoneNumber ||
      !formData.address
    ) {
      toast.error("All fields must be filled out");
      return;
    }

    if (!/^0[0-9]{9}$/.test(formData.phoneNumber)) {
      toast.error("Phone number must be 10 digits long!");
      return;
    }

    if (!formData.avatar) {
      toast.error("Avatar URL must be provided");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/users/${formData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        toast.error(`Failed to update profile: ${error.message}`);
        return;
      }

      const updatedUser = await response.json();

      setFormData(updatedUser.user);
      setUser(updatedUser.user);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  /**
   * @function handleDeleteRequest
   * @description Sends a request to delete the user's account.
   * @async
   */
  const handleDeleteRequest = async () => {
    const confirm = window.confirm(
      setMessage(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    );
    if (!confirm) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/delete-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user._id,
          username: user.username,
          reason: "User requested account deletion",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send request.");
        setMessage("");
        return;
      }
      setMessage("✅ Your deletion request has been sent to the admin.");
      setError("");
    } catch (err) {
      console.error("Error sending delete request:", err);
      setError("An error occurred while sending the deletion request.");
      setMessage("");
    }
  };

  /**
   * @constant {Array<Object>} fieldsToShow
   * @description An array of fields to display in the profile form.
   */
  const fieldsToShow = [
    { key: "avatar", label: "Avatar" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "address", label: "Address" },
    { key: "username", label: "Username" },
  ];

  return (
    <div
      className="css-1tudbfc"
      style={{ width: "60vw", margin: "20px auto" }}
      // style={{
      //   maxWidth: "60vw",
      //   margin: "40px auto",
      //   padding: 32,
      //   borderRadius: 16,
      //   background: "#fff",
      //   boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      //   border: "1px solid #e0e0e0",
      // }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#1976d2",
          marginBottom: 32,
          fontSize: 28,
          letterSpacing: 1,
        }}
      >
        Profile Details
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {user.avatar ? (
          <div
            className="image-container"
            style={{ margin: "0px auto", textAlign: "center" }}
          >
            <img
              src={user.avatar}
              alt="Avatar"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #1976d2",
                boxShadow: "0 2px 12px rgba(25, 118, 210, 0.15)",
                background: "#f0f0f0",
                display: "block",
                margin: "0 auto",
              }}
            />
            {user.role === "admin" && (
              <h1 style={{ fontWeight: "bold" }}>Admin</h1>
            )}
            <div>
              <button
                onClick={handleDeleteRequest}
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  padding: "16px 32px",
                  marginTop: "50px",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#b91c1c")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc2626")
                }
              >
                Request Account Deletion
              </button>

              {message && <p className="text-green-600 mt-2">{message}</p>}
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="image-container">
            <img
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #bdbdbd",
                boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
                background: "#f0f0f0",
                display: "block",
                margin: "0 auto",
              }}
              src="https://t4.ftcdn.net/jpg/08/23/95/89/360_F_823958944_1c9covIC7Tl7eyJtWoTiXc0L4vP6f43q.jpg"
              alt="Default Avatar"
            />
            <div>
              <button
                onClick={handleDeleteRequest}
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  padding: "16px 32px",
                  marginTop: "50px",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#b91c1c")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc2626")
                }
              >
                Request Account Deletion
              </button>

              {message && <p className="text-green-600 mt-2">{message}</p>}
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>
          </div>
        )}

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            width: "50%",
            justifySelf: "flex-end",
          }}
        >
          <form onSubmit={(e) => onSubmit(e)}>
            {fieldsToShow.map(({ key, label }) => (
              <li key={key} style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: 6,
                    color: "#444",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  {label}
                </label>
                <input
                  type={key !== "phoneNumber" ? "text" : "number"}
                  value={formData[key] || ""}
                  onChange={(e) => {
                    if (key !== "username")
                      return handleChange(key, e.target.value);
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #bdbdbd",
                    borderRadius: 8,
                    background: "#f7f7f7",
                    fontSize: 16,
                    color: "#222",
                    fontWeight: 500,
                    outline: "none",
                  }}
                />
              </li>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="ghost" color={"grey"} type={"submit"}>
                Save
              </Button>
            </div>
          </form>
        </ul>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default ProfileDetailsComponent;
