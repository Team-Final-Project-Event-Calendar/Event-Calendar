import axios from "axios";
import { AuthContext } from "../Authentication/AuthContext";
import { useState, useContext, useEffect } from "react";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

const EventSeriesForm = ({ onSeriesCreated }) => {
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [series, setSeries] = useState({
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
      frequency: "weekly",
      startTime: { hour: 9, minute: 0 },
      endTime: { hour: 10, minute: 0 },
      location: { address: "", city: "", country: "" },
    },
    endingEvent: {
      title: "",
      description: "",
      startDateTime: "",
      frequency: "weekly",
      startTime: { hour: 9, minute: 0 },
      endTime: { hour: 10, minute: 0 },
      location: { address: "", city: "", country: "" },
    },
    eventsId: [],
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (series.seriesType === "recurring") {
      if (series.startingEvent.frequency !== series.recurrenceRule.frequency) {
        setSeries((prev) => ({
          ...prev,
          recurrenceRule: { ...prev.recurrenceRule, frequency: prev.startingEvent.frequency },
          endingEvent: { ...prev.endingEvent, frequency: prev.startingEvent.frequency },
        }));
      }
    }
  }, [series.startingEvent.frequency, series.seriesType]);


    useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await axios.get(`${key}/api/events/mine`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }

    fetchAllEvents();
  }, []);



  const handleStartingEventChange = (field, value) => {
    setSeries((prev) => ({
      ...prev,
      startingEvent: { ...prev.startingEvent, [field]: value },
    }));
  };

  const handleStartingEventTimeChange = (field, value) => {
    setSeries((prev) => ({
      ...prev,
      startingEvent: {
        ...prev.startingEvent,
        [field]: {
          ...prev.startingEvent[field],
          ...value,
        },
      },
    }));
  };

  const handleEndingEventChange = (field, value) => {
    setSeries((prev) => ({
      ...prev,
      endingEvent: { ...prev.endingEvent, [field]: value },
    }));
  };

  const handleEndingEventTimeChange = (field, value) => {
    setSeries((prev) => ({
      ...prev,
      endingEvent: {
        ...prev.endingEvent,
        [field]: {
          ...prev.endingEvent[field],
          ...value,
        },
      },
    }));
  };

  const validate = () => {
    const errors = {};

    if (!series.name.trim()) errors.name = "Series name is required";

    if (!series.startingEvent.title.trim())
      errors.startingEventTitle = "Starting event title is required";

    if (!series.startingEvent.description.trim())
      errors.startingEventDescription = "Starting event description is required";

    if (!series.startingEvent.startDateTime)
      errors.startingEventStart = "Starting event date/time is required";

    if (!series.isIndefinite) {
      if (!series.endingEvent.title.trim())
        errors.endingEventTitle = "Ending event title is required";

      if (!series.endingEvent.description.trim())
        errors.endingEventDescription = "Ending event description is required";

      if (!series.endingEvent.startDateTime)
        errors.endingEventStart = "Ending event date/time is required";

      if (
        series.startingEvent.startDateTime &&
        series.endingEvent.startDateTime &&
        new Date(series.endingEvent.startDateTime) <= new Date(series.startingEvent.startDateTime)
      ) {
        errors.endingEventStart = "Ending event must be after starting event date/time";
      }
    }

    if (series.seriesType === "manual" && series.eventsId.length === 0)
      errors.eventsId = "Please select at least one event for manual series";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const seriesData = {
      name: series.name.trim(),
      creatorId: user._id,
      seriesType: series.seriesType,
      isIndefinite: series.isIndefinite,
      startingEvent: {
        ...series.startingEvent,
        startDateTime: series.startingEvent.startDateTime,
        frequency: series.startingEvent.frequency,
        startTime: series.startingEvent.startTime,
        endTime: series.startingEvent.endTime,
      },
      endingEvent: series.isIndefinite
        ? undefined
        : {
            ...series.endingEvent,
            startDateTime: series.endingEvent.startDateTime,
            frequency: series.endingEvent.frequency,
            startTime: series.endingEvent.startTime,
            endTime: series.endingEvent.endTime,
          },
      recurrenceRule:
        series.seriesType === "recurring"
          ? {
              frequency: series.recurrenceRule.frequency,
              endDate: series.isIndefinite ? null : series.endingEvent.startDateTime,
            }
          : undefined,
      eventsId: series.seriesType === "manual" ? series.eventsId : [],
    };

    try {
      await axios.post(`${key}/api/event-series`, seriesData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSuccessMessage("Event series created successfully!");
      if (onSeriesCreated) onSeriesCreated(seriesData);

      setSeries({
        name: "",
        seriesType: "recurring",
        recurrenceRule: { frequency: "weekly", endDate: "" },
        eventsId: [],
        isIndefinite: false,
        startingEvent: {
          title: "",
          description: "",
          startDateTime: "",
          frequency: "weekly",
          startTime: { hour: 9, minute: 0 },
          endTime: { hour: 10, minute: 0 },
          location: { address: "", city: "", country: "" },
        },
        endingEvent: {
          title: "",
          description: "",
          startDateTime: "",
          frequency: "weekly",
          startTime: { hour: 9, minute: 0 },
          endTime: { hour: 10, minute: 0 },
          location: { address: "", city: "", country: "" },
        },
      });
      setErrors({});
    } catch (error) {
      setErrors({ general: "Failed to create event series" });
      console.error("Failed to create event series:", error);
    }
  };

  const frequencyOptions = ["daily", "weekly", "monthly", "yearly"];
  const formatWithLeadingZero = (num) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2>Create Event Series</h2>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

      <div style={{ marginBottom: 16 }}>
        <label>Series Name:</label>
        <input
          type="text"
          value={series.name}
          onChange={(e) => setSeries((prev) => ({ ...prev, name: e.target.value }))}
          required
          style={{ width: "100%", padding: 8 }}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Series Type:</label>
        <select
          value={series.seriesType}
          onChange={(e) => setSeries((prev) => ({ ...prev, seriesType: e.target.value }))}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="recurring">Recurring (Automatic)</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {series.seriesType === "recurring" && (
        <>
          <div style={{ marginBottom: 16 }}>
            <label>Frequency:</label>
            <select
              value={series.startingEvent.frequency}
              onChange={(e) =>
                setSeries((prev) => ({
                  ...prev,
                  startingEvent: { ...prev.startingEvent, frequency: e.target.value },
                }))
              }
              style={{ width: "100%", padding: 8 }}
            >
              {frequencyOptions.map((freq) => (
                <option key={freq} value={freq}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label>
              <input
                type="checkbox"
                checked={series.isIndefinite}
                onChange={(e) => setSeries((prev) => ({ ...prev, isIndefinite: e.target.checked }))}
              />
              Indefinite Series (no end date)
            </label>
          </div>
        </>
      )}


      <fieldset style={{ marginBottom: 20, padding: 10, border: "1px solid #ccc" }}>
        <legend>Starting Event</legend>

        <div style={{ marginBottom: 12 }}>
          <label>Title:</label>
          <input
            type="text"
            value={series.startingEvent.title}
            onChange={(e) => handleStartingEventChange("title", e.target.value)}
            style={{ width: "100%", padding: 6 }}
          />
          {errors.startingEventTitle && <p style={{ color: "red" }}>{errors.startingEventTitle}</p>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Description:</label>
          <textarea
            value={series.startingEvent.description}
            onChange={(e) => handleStartingEventChange("description", e.target.value)}
            style={{ width: "100%", padding: 6 }}
          />
          {errors.startingEventDescription && (
            <p style={{ color: "red" }}>{errors.startingEventDescription}</p>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Date:</label>
          <input
            type="date"
            value={series.startingEvent.startDateTime.slice(0, 10)}
            onChange={(e) => {
              const date = e.target.value;
          
              const timePart = series.startingEvent.startDateTime.slice(11) || "09:00";
              handleStartingEventChange("startDateTime", date + "T" + timePart);
            }}
            style={{ width: "100%", padding: 6 }}
          />
          {errors.startingEventStart && <p style={{ color: "red" }}>{errors.startingEventStart}</p>}
        </div>

        <div style={{ display: "flex", gap: "12px", marginBottom: 12 }}>
  <div>
    <label>Start Time:</label>
    <div style={{ display: "flex", gap: 6 }}>
      <input
        type="number"
        min="0"
        max="23"
        value={formatWithLeadingZero(series.startingEvent.startTime.hour)}
        onChange={(e) =>
          handleStartingEventTimeChange("startTime", {
            hour: Math.min(23, Math.max(0, Number(e.target.value))),
          })
        }
        style={{ width: 50, padding: 4 }}
      />
      <span>:</span>
      <input
        type="number"
        min="0"
        max="59"
        value={formatWithLeadingZero(series.startingEvent.startTime.minute)}
        onChange={(e) =>
          handleStartingEventTimeChange("startTime", {
            minute: Math.min(59, Math.max(0, Number(e.target.value))),
          })
        }
        style={{ width: 50, padding: 4 }}
      />
    </div>
  </div>

  <div>
    <label>End Time:</label>
    <div style={{ display: "flex", gap: 6 }}>
      <input
        type="number"
        min="0"
        max="23"
        value={formatWithLeadingZero(series.startingEvent.endTime.hour)}
        onChange={(e) =>
          handleStartingEventTimeChange("endTime", {
            hour: Math.min(23, Math.max(0, Number(e.target.value))),
          })
        }
        style={{ width: 50, padding: 4 }}
      />
      <span>:</span>
      <input
        type="number"
        min="0"
        max="59"
        value={formatWithLeadingZero(series.startingEvent.endTime.minute)}
        onChange={(e) =>
          handleStartingEventTimeChange("endTime", {
            minute: Math.min(59, Math.max(0, Number(e.target.value))),
          })
        }
        style={{ width: 50, padding: 4 }}
      />
    </div>
  </div>
</div>


        <div style={{ marginBottom: 12 }}>
          <label>Address:</label>
          <input
            type="text"
            value={series.startingEvent.location.address}
            onChange={(e) =>
              setSeries((prev) => ({
                ...prev,
                startingEvent: {
                  ...prev.startingEvent,
                  location: { ...prev.startingEvent.location, address: e.target.value },
                },
              }))
            }
            style={{ width: "100%", padding: 6 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>City:</label>
          <input
            type="text"
            value={series.startingEvent.location.city}
            onChange={(e) =>
              setSeries((prev) => ({
                ...prev,
                startingEvent: {
                  ...prev.startingEvent,
                  location: { ...prev.startingEvent.location, city: e.target.value },
                },
              }))
            }
            style={{ width: "100%", padding: 6 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Country:</label>
          <input
            type="text"
            value={series.startingEvent.location.country}
            onChange={(e) =>
              setSeries((prev) => ({
                ...prev,
                startingEvent: {
                  ...prev.startingEvent,
                  location: { ...prev.startingEvent.location, country: e.target.value },
                },
              }))
            }
            style={{ width: "100%", padding: 6 }}
          />
        </div>
      </fieldset>

      {!series.isIndefinite && (
        <fieldset style={{ marginBottom: 20, padding: 10, border: "1px solid #ccc" }}>
          <legend>Ending Event</legend>

          <div style={{ marginBottom: 12 }}>
            <label>Title:</label>
            <input
              type="text"
              value={series.endingEvent.title}
              onChange={(e) => handleEndingEventChange("title", e.target.value)}
              style={{ width: "100%", padding: 6 }}
            />
            {errors.endingEventTitle && <p style={{ color: "red" }}>{errors.endingEventTitle}</p>}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Description:</label>
            <textarea
              value={series.endingEvent.description}
              onChange={(e) => handleEndingEventChange("description", e.target.value)}
              style={{ width: "100%", padding: 6 }}
            />
            {errors.endingEventDescription && (
              <p style={{ color: "red" }}>{errors.endingEventDescription}</p>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Date:</label>
            <input
              type="date"
              value={series.endingEvent.startDateTime.slice(0, 10)}
              onChange={(e) => {
                const date = e.target.value;
                const timePart = series.endingEvent.startDateTime.slice(11) || "10:00";
                handleEndingEventChange("startDateTime", date + "T" + timePart);
              }}
              style={{ width: "100%", padding: 6 }}
            />
            {errors.endingEventStart && <p style={{ color: "red" }}>{errors.endingEventStart}</p>}
          </div>

    
          <div style={{ display: "flex", gap: "12px", marginBottom: 12 }}>
  <div>
    <label>Start Time:</label>
    <div style={{ display: "flex", gap: 6 }}>
      <input
        type="number"
        min="0"
        max="23"
        value={formatWithLeadingZero(series.endingEvent.startTime.hour)}
        onChange={(e) =>
          handleEndingEventTimeChange("startTime", {
            hour: Math.min(23, Math.max(0, Number(e.target.value))),
          })
        }
        style={{ width: 50, padding: 4 }}
      />
      <span>:</span>
      <input
        type="number"
        min="0"
        max="59"
        value={formatWithLeadingZero(series.endingEvent.startTime.minute)}
        onChange={(e) =>
          handleEndingEventTimeChange("startTime", {
            minute: Math.min(59, Math.max(0, Number(e.target.value))),
          })
        }
        style={{ width: 50, padding: 4 }}
      />
    </div>
  </div>

  <div>
    <label>End Time:</label>
    <div style={{ display: "flex", gap: 6 }}>
      <input
        type="number"
        min="0"
        max="23"
        value={formatWithLeadingZero(series.endingEvent.endTime.hour)}
        onChange={(e) =>
          handleEndingEventTimeChange("endTime", {
            hour: Math.min(23, Math.max(0, Number(e.target.value))),
          })
        }
        style={{ width: 50, padding: 4 }}
      />
      <span>:</span>
      <input
        type="number"
        min="0"
        max="59"
        value={formatWithLeadingZero(series.endingEvent.endTime.minute)}
        onChange={(e) =>
          handleEndingEventTimeChange("endTime", {
            minute: Math.min(59, Math.max(0, Number(e.target.value))),
          })
        }
        style={{ width: 50, padding: 4 }}
      />
    </div>
  </div>
</div>



          <div style={{ marginBottom: 12 }}>
            <label>Address:</label>
            <input
              type="text"
              value={series.endingEvent.location.address}
              onChange={(e) =>
                setSeries((prev) => ({
                  ...prev,
                  endingEvent: {
                    ...prev.endingEvent,
                    location: { ...prev.endingEvent.location, address: e.target.value },
                  },
                }))
              }
              style={{ width: "100%", padding: 6 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>City:</label>
            <input
              type="text"
              value={series.endingEvent.location.city}
              onChange={(e) =>
                setSeries((prev) => ({
                  ...prev,
                  endingEvent: {
                    ...prev.endingEvent,
                    location: { ...prev.endingEvent.location, city: e.target.value },
                  },
                }))
              }
              style={{ width: "100%", padding: 6 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Country:</label>
            <input
              type="text"
              value={series.endingEvent.location.country}
              onChange={(e) =>
                setSeries((prev) => ({
                  ...prev,
                  endingEvent: {
                    ...prev.endingEvent,
                    location: { ...prev.endingEvent.location, country: e.target.value },
                  },
                }))
              }
              style={{ width: "100%", padding: 6 }}
            />
          </div>
        </fieldset>
      )}

{series.seriesType === "manual" && (
        <fieldset style={{ marginBottom: 16 }}>
          <legend>Manual Events Selection</legend>
          {events.map((event) => (
            <div key={event._id || event.id}>
              <input
                type="checkbox"
                id={`event-${event._id || event.id}`}
                checked={series.eventsId.includes(event._id || event.id)}
                onChange={() => handleManualEventsChange(event._id || event.id)}
              />
              <label htmlFor={`event-${event._id || event.id}`}>{event.title}</label>
            </div>
          ))}
          {errors.eventsId && <p style={{ color: "red" }}>{errors.eventsId}</p>}
        </fieldset>
      )}


      <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
        Create Series
      </button>
    </form>
  );
};

export default EventSeriesForm;
