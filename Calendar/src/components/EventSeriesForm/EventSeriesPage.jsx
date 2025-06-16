import { useState, useEffect } from "react";
import EventSeriesForm from "./EventSeriesForm";
import axios from "axios";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

const EventSeriesPage = () => {
  const [eventSeries, setEventSeries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEventSeries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${key}/api/event-series`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEventSeries(response.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch event series:", error);
      setError("Failed to load event series. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventSeries();
  }, []);

  const handleSeriesCreated = (newSeries) => {
    setEventSeries([...eventSeries, newSeries]);
    setShowForm(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Format time for display
  const formatTime = (timeObj) => {
    if (!timeObj) return "N/A";
    const { hour, minute } = timeObj;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  // Delete event series
  const handleDeleteSeries = async (seriesId) => {
    if (window.confirm("Are you sure you want to delete this series?")) {
      try {
        await axios.delete(`${key}/api/event-series/${seriesId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEventSeries(eventSeries.filter(series => series._id !== seriesId));
      } catch (error) {
        console.error("Failed to delete event series:", error);
        alert("Failed to delete series. Please try again.");
      }
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: "#1976d2", marginBottom: "1.5rem" }}>Event Series Management</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          marginBottom: "2rem",
          padding: "0.75rem 1.5rem",
          background: "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {showForm ? "Cancel" : "Create New Series"}
      </button>

      {showForm && <EventSeriesForm onSeriesCreated={handleSeriesCreated} />}

      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ color: "#333", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
          Your Event Series
        </h2>
        
        {loading && <p>Loading event series...</p>}
        
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {!loading && !error && eventSeries.length === 0 && (
          <p>No event series created yet.</p>
        )}
        
        {!loading && !error && eventSeries.map((series) => (
          <div
            key={series._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1.5rem",
              margin: "1.5rem 0",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              background: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: "0 0 1rem 0", color: "#1976d2" }}>{series.name}</h3>
              <button
                onClick={() => handleDeleteSeries(series._id)}
                style={{
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.5rem 0.75rem",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Left column */}
              <div>
                <p><strong>Type:</strong> {series.seriesType === 'recurring' ? 'Recurring (Automatic)' : 'Manual'}</p>
                <p><strong>Duration:</strong> {series.isIndefinite ? 'Indefinite' : 'Fixed period'}</p>
                
                {series.seriesType === "recurring" && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <p><strong>Frequency:</strong> {series.recurrenceRule?.frequency}</p>
                    {!series.isIndefinite && series.recurrenceRule?.endDate && (
                      <p><strong>End Date:</strong> {formatDate(series.recurrenceRule.endDate)}</p>
                    )}
                  </div>
                )}
                
                {series.seriesType === "manual" && series.eventsId && (
                  <p><strong>Additional Events:</strong> {series.eventsId.length}</p>
                )}
              </div>
              
              {/* Right column */}
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ marginBottom: "0.5rem", color: "#444" }}>Starting Event</h4>
                  <p><strong>Title:</strong> {series.startingEvent.title}</p>
                  <p><strong>Date:</strong> {formatDate(series.startingEvent.startDateTime)}</p>
                  <p><strong>Time:</strong> {formatTime(series.startingEvent.startTime)} - {formatTime(series.startingEvent.endTime)}</p>
                  {series.startingEvent.location && series.startingEvent.location.city && (
                    <p><strong>Location:</strong> {series.startingEvent.location.city}</p>
                  )}
                </div>
                
                {!series.isIndefinite && series.endingEvent && (
                  <div>
                    <h4 style={{ marginBottom: "0.5rem", color: "#444" }}>Ending Event</h4>
                    <p><strong>Title:</strong> {series.endingEvent.title}</p>
                    <p><strong>Date:</strong> {formatDate(series.endingEvent.startDateTime)}</p>
                    <p><strong>Time:</strong> {formatTime(series.endingEvent.startTime)} - {formatTime(series.endingEvent.endTime)}</p>
                    {series.endingEvent.location && series.endingEvent.location.city && (
                      <p><strong>Location:</strong> {series.endingEvent.location.city}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Description section */}
            <div style={{ marginTop: "1rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
              <p><strong>Description:</strong></p>
              <p style={{ 
                padding: "0.75rem", 
                background: "#f9f9f9", 
                borderRadius: "4px",
                maxHeight: "100px",
                overflowY: "auto"
              }}>
                {series.startingEvent.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSeriesPage;