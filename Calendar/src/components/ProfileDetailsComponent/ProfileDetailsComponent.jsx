import React, { useRef, useState } from "react";

function ProfileDetailsComponent({ userDetails, onProfileUpdate, token }) {
  const [avatarPreview, setAvatarPreview] = useState(userDetails?.image || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

  if (!userDetails) {
    return null;
  }
  const fieldsToShow = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "adress", label: "Address" },
    { key: "username", label: "Username" },
  ];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", avatarFile);
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload avatar");
      const updated = await res.json();
      if (onProfileUpdate) onProfileUpdate(updated);
      setUploading(false);
      alert("Avatar updated!");
    } catch {
      setUploading(false);
      alert("Failed to upload avatar");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
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
          textAlign: "center",
          marginBottom: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={avatarPreview || "/default-avatar.png"}
          alt="Avatar"
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #1976d2",
          }}
        />
        <div style={{ marginTop: 12 }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
          <button
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 16px",
              fontWeight: 600,
              cursor: "pointer",
              marginRight: 8,
            }}
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
          >
            Choose Avatar
          </button>
          <button
            style={{
              background: uploading ? "#bdbdbd" : "#43a047",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "6px 16px",
              fontWeight: 600,
              cursor: uploading ? "not-allowed" : "pointer",
            }}
            onClick={handleSaveAvatar}
            disabled={uploading || !avatarFile}
          >
            {uploading ? "Uploading..." : "Save Avatar"}
          </button>
        </div>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
              type="text"
              value={userDetails[key] || ""}
              readOnly
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
      </ul>
    </div>
  );
}

export default ProfileDetailsComponent;
