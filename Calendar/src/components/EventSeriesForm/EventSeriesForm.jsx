/**
 * @file EventSeriesForm.jsx
 * @description A React component for creating and managing event series. It supports recurring and indefinite series, as well as manual event selection.
 */

import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";
import { useState, useEffect, useContext } from "react";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

/**
 * @function EventSeriesForm
 * @description A form component for creating event series. It allows users to define starting and ending events, recurrence rules, and more.
 * @param {Object} props - The component props.
 * @param {Function} props.onSeriesCreated - Callback function triggered when a new event series is successfully created.
 * @returns {JSX.Element} The rendered EventSeriesForm component.
 */
const EventSeriesForm = ({ onSeriesCreated }) => {
  const { user } = useContext(AuthContext);

  const [series, setSeries] = useState({
    name: "",
    seriesType: "recurring",
    recurrenceRule: {
      frequency: "weekly",
      endDate: "",
    },
    eventsId: [],
    isIndefinite: false,
    startingEvent: {
      title: "",
      description: "",
      startDateTime: "",
      startTime: {
        hour: 9,
        minute: 0,
      },
      endTime: {
        hour: 10,
        minute: 0,
      },
      location: {
        address: "",
        city: "",
        country: "",
      },
    },
    endingEvent: {
      title: "",
      description: "",
      startDateTime: "",
      startTime: {
        hour: 9,
        minute: 0,
      },
      endTime: {
        hour: 10,
        minute: 0,
      },
      location: {
        address: "",
        city: "",
        country: "",
      },
    },
  });

  const [events, setEvents] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * @function fetchEvents
   * @description Fetches the user's events for manual series selection.
   * @async
   */
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

  /**
   * @function handleStartingEventChange
   * @description Updates a field in the starting event.
   * @param {string} field - The field to update (e.g., "title", "description").
   * @param {string} value - The new value for the field.
   */
  const handleStartingEventChange = (field, value) => {
    setSeries({
      ...series,
      startingEvent: {
        ...series.startingEvent,
        [field]: value,
      },
    });
  };

  /**
   * @function handleStartingEventTimeChange
   * @description Updates the time fields (hour or minute) for the starting event.
   * @param {string} timeType - The type of time field to update ("startTime" or "endTime").
   * @param {string} field - The field to update ("hour" or "minute").
   * @param {number} value - The new value for the field.
   */
  const handleStartingEventTimeChange = (timeType, field, value) => {
    setSeries({
      ...series,
      startingEvent: {
        ...series.startingEvent,
        [timeType]: {
          ...series.startingEvent[timeType],
          [field]: parseInt(value, 10),
        },
      },
    });
  };

  /**
   * @function handleStartingEventLocationChange
   * @description Updates a location field for the starting event.
   * @param {string} field - The location field to update (e.g., "address", "city").
   * @param {string} value - The new value for the field.
   */
  const handleStartingEventLocationChange = (field, value) => {
    setSeries({
      ...series,
      startingEvent: {
        ...series.startingEvent,
        location: {
          ...series.startingEvent.location,
          [field]: value,
        },
      },
    });
  };

  /**
   * @function handleEndingEventChange
   * @description Updates a field in the ending event.
   * @param {string} field - The field to update (e.g., "title", "description").
   * @param {string} value - The new value for the field.
   */
  const handleEndingEventChange = (field, value) => {
    setSeries({
      ...series,
      endingEvent: {
        ...series.endingEvent,
        [field]: value,
      },
    });
  };

  /**
   * @function handleEndingEventTimeChange
   * @description Updates the time fields (hour or minute) for the ending event.
   * @param {string} timeType - The type of time field to update ("startTime" or "endTime").
   * @param {string} field - The field to update ("hour" or "minute").
   * @param {number} value - The new value for the field.
   */
  const handleEndingEventTimeChange = (timeType, field, value) => {
    setSeries({
      ...series,
      endingEvent: {
        ...series.endingEvent,
        [timeType]: {
          ...series.endingEvent[timeType],
          [field]: parseInt(value, 10),
        },
      },
    });
  };

  /**
   * @function handleEndingEventLocationChange
   * @description Updates a location field for the ending event.
   * @param {string} field - The location field to update (e.g., "address", "city").
   * @param {string} value - The new value for the field.
   */
  const handleEndingEventLocationChange = (field, value) => {
    setSeries({
      ...series,
      endingEvent: {
        ...series.endingEvent,
        location: {
          ...series.endingEvent.location,
          [field]: value,
        },
      },
    });
  };

  /**
   * @function validate
   * @description Validates the event series form fields and sets error messages if validation fails.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validate = () => {
    const errors = {};

    if (!series.name) {
      errors.name = "Series name is required";
    }

    if (!series.startingEvent.title) {
      errors.startingEventTitle = "Starting event title is required";
    }

    if (!series.startingEvent.description) {
      errors.startingEventDescription = "Starting event description is required";
    }

    if (!series.startingEvent.startDateTime) {
      errors.startingEventStart = "Starting event date is required";
    }

    if (!series.isIndefinite) {
      if (!series.endingEvent.title) {
        errors.endingEventTitle = "Ending event title is required";
      }

      if (!series.endingEvent.description) {
        errors.endingEventDescription = "Ending event description is required";
      }

      if (!series.endingEvent.startDateTime) {
        errors.endingEventStart = "Ending event date is required";
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * @function handleSubmit
   * @description Handles the form submission to create a new event series.
   * @param {Object} e - The form submission event.
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const seriesData = {
        name: series.name,
        creatorId: user._id,
        seriesType: "recurring",
        isIndefinite: series.isIndefinite,
        startingEvent: series.startingEvent,
        endingEvent: series.isIndefinite ? undefined : series.endingEvent,
        recurrenceRule:
          series.seriesType === "recurring" ? series.recurrenceRule : undefined,
      };

      const response = await axios.post(`${key}/api/event-series`, seriesData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccessMessage("Event series created successfully!");
      if (onSeriesCreated) onSeriesCreated(response.data);

      setSeries({
        name: "",
        seriesType: "recurring",
        recurrenceRule: {
          frequency: "weekly",
          endDate: "",
        },
        isIndefinite: false,
        startingEvent: {
          title: "",
          description: "",
          startDateTime: "",
          startTime: { hour: 9, minute: 0 },
          endTime: { hour: 10, minute: 0 },
          location: { address: "", city: "", country: "" },
        },
        endingEvent: {
          title: "",
          description: "",
          startDateTime: "",
          startTime: { hour: 9, minute: 0 },
          endTime: { hour: 10, minute: 0 },
          location: { address: "", city: "", country: "" },
        },
      });
    } catch (error) {
      setErrors({ general: "Failed to create event series" });
      console.error("Failed to create event series:", error);
    }
  };

  /**
   * @function generateTimeOptions
   * @description Generates time options for hours (0-23) or minutes (0-55 in 5-minute increments).
   * @param {string} type - The type of time options to generate ("hour" or "minute").
   * @returns {Array<JSX.Element>} An array of `<option>` elements for the time options.
   */
  const generateTimeOptions = (type) => {
    if (type === "hour") {
      return Array.from({ length: 24 }, (_, i) => (
        <option key={i} value={i}>
          {i.toString().padStart(2, "0")}
        </option>
      ));
    } else {
      return Array.from({ length: 12 }, (_, i) => (
        <option key={i * 5} value={i * 5}>
          {(i * 5).toString().padStart(2, "0")}
        </option>
      ));
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
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
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
          {/* <option value="manual">Manual</option> */}
        </select>
      </div>

      {/* STARTING EVENT SECTION */}
      <fieldset style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1.5rem", borderRadius: "4px" }}>
        <legend style={{ padding: "0 10px", fontWeight: "bold" }}>Starting Event</legend>

        <div style={{ marginBottom: "1rem" }}>
          <label>Title:</label>
          <input
            type="text"
            value={series.startingEvent.title}
            onChange={(e) => handleStartingEventChange("title", e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
          {errors.startingEventTitle && <p style={{ color: "red" }}>{errors.startingEventTitle}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Description:</label>
          <textarea
            value={series.startingEvent.description}
            onChange={(e) => handleStartingEventChange("description", e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }}
          />
          {errors.startingEventDescription && <p style={{ color: "red" }}>{errors.startingEventDescription}</p>}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Start Date:</label>
          <input
            type="date"
            value={series.startingEvent.startDateTime}
            onChange={(e) => handleStartingEventChange("startDateTime", e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
          {errors.startingEventStart && <p style={{ color: "red" }}>{errors.startingEventStart}</p>}
        </div>

        <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            <label>Start Time:</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select
                value={series.startingEvent.startTime.hour}
                onChange={(e) => handleStartingEventTimeChange("startTime", "hour", e.target.value)}
                style={{ flex: 1, padding: "0.5rem" }}
              >
                {generateTimeOptions('hour')}
              </select>
              <span style={{ alignSelf: "center" }}>:</span>
              <select
                value={series.startingEvent.startTime.minute}
                onChange={(e) => handleStartingEventTimeChange("startTime", "minute", e.target.value)}
                style={{ flex: 1, padding: "0.5rem" }}
              >
                {generateTimeOptions('minute')}
              </select>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <label>End Time:</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <select
                value={series.startingEvent.endTime.hour}
                onChange={(e) => handleStartingEventTimeChange("endTime", "hour", e.target.value)}
                style={{ flex: 1, padding: "0.5rem" }}
              >
                {generateTimeOptions('hour')}
              </select>
              <span style={{ alignSelf: "center" }}>:</span>
              <select
                value={series.startingEvent.endTime.minute}
                onChange={(e) => handleStartingEventTimeChange("endTime", "minute", e.target.value)}
                style={{ flex: 1, padding: "0.5rem" }}
              >
                {generateTimeOptions('minute')}
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Location (Optional):</label>
          <input
            type="text"
            placeholder="Address"
            value={series.startingEvent.location.address}
            onChange={(e) => handleStartingEventLocationChange("address", e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="City"
            value={series.startingEvent.location.city}
            onChange={(e) => handleStartingEventLocationChange("city", e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Country"
            value={series.startingEvent.location.country}
            onChange={(e) => handleStartingEventLocationChange("country", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
      </fieldset>

      {/* Recurring Options */}
      {series.seriesType === "recurring" && (
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
            {/* <option value="daily">Daily</option> */}
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      )}

      {/* Indefinite Checkbox */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center" }}>
          <p style={{ fontSize: "17px" }}>Run series indefinitely:</p>
          <input
            style={{ scale: "1.7", marginLeft: "1rem" }}
            type="checkbox"
            checked={series.isIndefinite}
            onChange={(e) => setSeries({ ...series, isIndefinite: e.target.checked })}
          />
        </label>
      </div>

      {/* ENDING EVENT SECTION - Only if not indefinite */}
      {!series.isIndefinite && (
        <fieldset style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1.5rem", borderRadius: "4px" }}>
          <legend style={{ padding: "0 10px", fontWeight: "bold" }}>Ending Event</legend>

          <div style={{ marginBottom: "1rem" }}>
            <label>Title:</label>
            <input
              type="text"
              value={series.endingEvent.title}
              onChange={(e) => handleEndingEventChange("title", e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
            {errors.endingEventTitle && <p style={{ color: "red" }}>{errors.endingEventTitle}</p>}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Description:</label>
            <textarea
              value={series.endingEvent.description}
              onChange={(e) => handleEndingEventChange("description", e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem", minHeight: "100px" }}
            />
            {errors.endingEventDescription && <p style={{ color: "red" }}>{errors.endingEventDescription}</p>}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>End Date:</label>
            <input
              type="date"
              value={series.endingEvent.startDateTime}
              onChange={(e) => handleEndingEventChange("startDateTime", e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
            {errors.endingEventStart && <p style={{ color: "red" }}>{errors.endingEventStart}</p>}
          </div>

          <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label>Start Time:</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  value={series.endingEvent.startTime.hour}
                  onChange={(e) => handleEndingEventTimeChange("startTime", "hour", e.target.value)}
                  style={{ flex: 1, padding: "0.5rem" }}
                >
                  {generateTimeOptions('hour')}
                </select>
                <span style={{ alignSelf: "center" }}>:</span>
                <select
                  value={series.endingEvent.startTime.minute}
                  onChange={(e) => handleEndingEventTimeChange("startTime", "minute", e.target.value)}
                  style={{ flex: 1, padding: "0.5rem" }}
                >
                  {generateTimeOptions('minute')}
                </select>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <label>End Time:</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  value={series.endingEvent.endTime.hour}
                  onChange={(e) => handleEndingEventTimeChange("endTime", "hour", e.target.value)}
                  style={{ flex: 1, padding: "0.5rem" }}
                >
                  {generateTimeOptions('hour')}
                </select>
                <span style={{ alignSelf: "center" }}>:</span>
                <select
                  value={series.endingEvent.endTime.minute}
                  onChange={(e) => handleEndingEventTimeChange("endTime", "minute", e.target.value)}
                  style={{ flex: 1, padding: "0.5rem" }}
                >
                  {generateTimeOptions('minute')}
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Location (Optional):</label>
            <input
              type="text"
              placeholder="Address"
              value={series.endingEvent.location.address}
              onChange={(e) => handleEndingEventLocationChange("address", e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
            />
            <input
              type="text"
              placeholder="City"
              value={series.endingEvent.location.city}
              onChange={(e) => handleEndingEventLocationChange("city", e.target.value)}
              style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
            />
            <input
              type="text"
              placeholder="Country"
              value={series.endingEvent.location.country}
              onChange={(e) => handleEndingEventLocationChange("country", e.target.value)}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        </fieldset>
      )}

      {/* Manual Event Selection (only for manual series) */}
      {/* {series.seriesType === "manual" && (
          <div style={{ marginBottom: "1rem" }}>
            <label>Select Additional Events for Manual Series:</label>
            <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "4px", maxHeight: "200px", overflowY: "auto" }}>
              {events.length === 0 ? (
                <p>No events available. Create some events first.</p>
              ) : (
                events.map((event) => (
                  <div key={event._id} style={{ marginBottom: "0.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={series.eventsId.includes(event._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Add event to series
                            setSeries({
                              ...series,
                              eventsId: [...series.eventsId, event._id]
                            });
                          } else {
                            // Remove event from series
                            setSeries({
                              ...series,
                              eventsId: series.eventsId.filter(id => id !== event._id)
                            });
                          }
                        }}
                        style={{ marginRight: "0.5rem" }}
                      />
                      <span>
                        {event.title} - {new Date(event.startDateTime).toLocaleDateString()}
                        {event.location?.city && ` (${event.location.city})`}
                      </span>
                    </label>
                  </div>
                ))
              )}
            </div>
            {series.eventsId.length > 0 && (
              <p style={{ marginTop: "0.5rem", color: "#666" }}>
                {series.eventsId.length} additional event(s) selected
              </p>
            )}
            {errors.eventsId && <p style={{ color: "red" }}>{errors.eventsId}</p>}
          </div>
        )} */}

      <button type="submit" style={{ width: "100%", padding: "0.75rem", background: "#1976d2", color: "white", border: "none", borderRadius: "4px" }}>
        Create Event Series
      </button>
    </form>
  );
};

export default EventSeriesForm;