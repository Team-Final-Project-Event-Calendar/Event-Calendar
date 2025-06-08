import React, { useContext } from "react";
import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { AuthContext } from "../../components/Authentication/AuthContext";
import { Avatar, Code, Stack, useAvatar } from "@chakra-ui/react";

const API_BASE_URL =
  import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

function ProfileDetailsComponent() {
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState(user || {});

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phoneNumber ||
      !formData.address
    ) {
      alert("All fields must be filled out");
      return;
    }

    if (!/^0[0-9]{9}$/.test(formData.phoneNumber)) {
      alert("Phone number must be 10 digits long!");
      return;
    }

    if (!formData.avatar) {
      alert("Avatar URL must be provided");
      return;
    }

    console.log("Form Data:", formData);

    console.log(
      "Sending PUT request to:",
      `${API_BASE_URL}/api/auth/users/${formData._id}`
    );
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
        alert(`Failed to update profile: ${error.message}`);
        return;
      }

      const updatedUser = await response.json();

      setFormData(updatedUser.user);
      setUser(updatedUser.user);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));

      // Update the user context and local state
      setFormData(updatedUser.user);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

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
      style={{
        maxWidth: "60vw",
        margin: "40px auto",
        padding: 32,
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        border: "1px solid #e0e0e0",
      }}
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
              style={{ width: "200px", borderRadius: "50%" }}
            ></img>
            {user.role === "admin" && (
              <h1 style={{ fontWeight: "bold" }}>Admin</h1>
            )}
          </div>
        ) : (
          <div className="image-container">
            <img
              style={{
                width: "200px",
                borderRadius: "50%",
                alignSelf: "center",
              }}
              src="https://t4.ftcdn.net/jpg/08/23/95/89/360_F_823958944_1c9covIC7Tl7eyJtWoTiXc0L4vP6f43q.jpg"
            ></img>
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
            <Button variant="ghost" color={"grey"} type={"submit"}>
              Save
            </Button>
          </form>
        </ul>
      </div>
    </div>
  );
}

export default ProfileDetailsComponent;
