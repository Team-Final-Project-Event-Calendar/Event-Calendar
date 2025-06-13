import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

const CreateContactsListForm = () => {
  const { user, token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [success, setSuccess] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentList, setCurrentList] = useState([]);

  const addUser = (username, id) => {
    if (currentList.find((u) => u.id === id)) {
      alert("User already added");
      return;
    }

    setCurrentList((prev) => [...prev, { username, id }]);
    setAllUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const removeUser = (id) => {
    const removedUser = currentList.find((u) => u.id === id);
    if (removedUser) {
      setCurrentList((prev) => prev.filter((u) => u.id !== id));
      setAllUsers((prev) => [
        ...prev,
        { _id: id, username: removedUser.username },
      ]);
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
      } finally {
        setLoading(false);
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

    console.log({
      title,
      creator: user._id,
      contacts: contactIds,
    });
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

      console.log("Created list:", res.data);
      setSuccess(true);
      setError("");
      setTitle("");
      setCurrentList([]);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create list.");
      setSuccess(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Create a Contacts List
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && (
        <p className="text-green-600 text-center">List created successfully!</p>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-semibold text-gray-600">
          List Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Gym Buddies"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* All Users */}
        <div className="bg-gray-100 p-4 rounded-md shadow-inner">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            All Users
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {allUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => addUser(user.username, user._id)}
                className="cursor-pointer px-3 py-1 bg-white rounded hover:bg-blue-100 text-gray-800 border"
              >
                {user.username}
              </div>
            ))}
            {allUsers.length === 0 && (
              <p className="text-sm text-gray-500 italic">No users available</p>
            )}
          </div>
        </div>

        {/* Selected Users */}
        <div className="bg-blue-50 p-4 rounded-md shadow-inner">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Selected Users
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-1">
            {currentList.map((u) => (
              <div
                key={u.id}
                onClick={() => removeUser(u.id)}
                className="cursor-pointer px-3 py-1 bg-white rounded hover:bg-red-100 text-gray-800 border"
              >
                {u.username}{" "}
                <span className="text-xs text-red-500">(click to remove)</span>
              </div>
            ))}
            {currentList.length === 0 && (
              <p className="text-sm text-gray-500 italic">No users selected</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
      >
        Create List
      </button>
    </form>
  );
};

export default CreateContactsListForm;
