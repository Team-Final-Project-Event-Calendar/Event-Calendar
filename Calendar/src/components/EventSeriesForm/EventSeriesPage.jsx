import { useState, useEffect } from "react";
import EventSeriesForm from "./EventSeriesForm";
import axios from "axios";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

const EventSeriesPage = () => {
  const [eventSeries, setEventSeries] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchEventSeries = async () => {
    try {
      const response = await axios.get(`${key}/api/event-series`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEventSeries(response.data);
    } catch (error) {
      console.error("Failed to fetch event series:", error);
    }
  };

  useEffect(() => {
    fetchEventSeries();
  }, []);

  const handleSeriesCreated = (newSeries) => {
    setEventSeries([...eventSeries, newSeries]);
    setShowForm(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Event Series Management</h1>
      
      <button 
        onClick={() => setShowForm(!showForm)}
        style={{ marginBottom: "2rem", padding: "0.75rem 1.5rem", background: "#1976d2", color: "white", border: "none", borderRadius: "4px" }}
      >
        {showForm ? "Cancel" : "Create New Series"}
      </button>

      {showForm && <EventSeriesForm onSeriesCreated={handleSeriesCreated} />}

      <div style={{ marginTop: "2rem" }}>
        <h2>Your Event Series</h2>
        {eventSeries.length === 0 ? (
          <p>No event series created yet.</p>
        ) : (
          eventSeries.map((series) => (
            <div key={series._id} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0", borderRadius: "4px" }}>
              <h3>{series.name}</h3>
              <p>Type: {series.seriesType}</p>
              <p>Indefinite: {series.isIndefinite ? "Yes" : "No"}</p>
              {series.seriesType === "recurring" && (
                <p>Frequency: {series.recurrenceRule?.frequency} (every {series.recurrenceRule?.interval})</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventSeriesPage;