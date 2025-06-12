import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";
import { useState, useEffect } from "react";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

const EventSeriesForm = ({ onSeriesCreated }) => {
  const [series, setSeries] = useState({
    name: "",
    startingEventId: "",
    endingEventId: "",
    seriesType: "recurring",
    recurrenceRule: {
      frequency: "weekly",
      interval: 1,
      endDate: ""
    },
    eventsId: [],
    isIndefinite: false
  });

  const [events, setEvents] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user's events for starting/ending event selection
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${key}/api/events`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${key}/api/event-series`, series, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      setSuccessMessage("Event series created successfully!");
      if (onSeriesCreated) onSeriesCreated(response.data);
      
      // Reset form
      setSeries({
        name: "",
        startingEventId: "",
        endingEventId: "",
        seriesType: "recurring",
        recurrenceRule: {
          frequency: "weekly",
          interval: 1,
          endDate: ""
        },
        eventsId: [],
        isIndefinite: false
      });
    } catch (error) {
      setErrors({ general: "Failed to create event series" });
      console.error("Failed to create event series:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Create Event Series</h2>
      
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

      {/* Series Name */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Series Name:</label>
        <input
          type="text"
          value={series.name}
          onChange={(e) => setSeries({ ...series, name: e.target.value })}
          required
          style={{ width: "100%", padding: "0.5rem" }}
        />
      </div>

      {/* Starting Event */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Starting Event:</label>
        <select
          value={series.startingEventId}
          onChange={(e) => setSeries({ ...series, startingEventId: e.target.value })}
          required
          style={{ width: "100%", padding: "0.5rem" }}
        >
          <option value="">Select starting event</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title} - {new Date(event.startDateTime).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Series Type */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Series Type:</label>
        <select
          value={series.seriesType}
          onChange={(e) => setSeries({ ...series, seriesType: e.target.value })}
          style={{ width: "100%", padding: "0.5rem" }}
        >
          <option value="recurring">Recurring (Automatic)</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {/* Recurring Options */}
      {series.seriesType === "recurring" && (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <label>Frequency:</label>
            <select
              value={series.recurrenceRule.frequency}
              onChange={(e) => setSeries({
                ...series,
                recurrenceRule: { ...series.recurrenceRule, frequency: e.target.value }
              })}
              style={{ width: "100%", padding: "0.5rem" }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Interval:</label>
            <input
              type="number"
              min="1"
              value={series.recurrenceRule.interval}
              onChange={(e) => setSeries({
                ...series,
                recurrenceRule: { ...series.recurrenceRule, interval: parseInt(e.target.value) }
              })}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        </>
      )}

      {/* Indefinite Checkbox */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          <input
            type="checkbox"
            checked={series.isIndefinite}
            onChange={(e) => setSeries({ ...series, isIndefinite: e.target.checked })}
          />
          Run indefinitely
        </label>
      </div>

      {/* Ending Event (only if not indefinite) */}
      {!series.isIndefinite && (
        <div style={{ marginBottom: "1rem" }}>
          <label>Ending Event (optional):</label>
          <select
            value={series.endingEventId}
            onChange={(e) => setSeries({ ...series, endingEventId: e.target.value })}
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="">Select ending event (optional)</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title} - {new Date(event.startDateTime).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "#1976d2", color: "white", border: "none", borderRadius: "4px" }}>
        Create Event Series
      </button>
    </form>
  );
};

export default EventSeriesForm;