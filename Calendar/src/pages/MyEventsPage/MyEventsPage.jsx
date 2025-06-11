import React, { useEffect, useState } from "react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import EventForm from "../../components/EventForm/EventForm";
import axios from "axios";
import WeatherWidget from "../../components/WeatherWidget/WeatherWidget";
const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";
function MyEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${key}/api/events`, {
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

    fetchEvents();
  }, []);

  const handleEventCreated = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleDeleteEvent = async (event) => {
    if (!event._id) return;
    try {
      await axios.delete(`${key}/api/events/${event._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEvents((prev) => prev.filter((e) => e._id !== event._id));
    } catch (err) {
      alert("Failed to delete event");
      console.error(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "50px",
        margin: "50px auto",
        justifyContent: "space-between",
        width: "60vw",
      }}
    >
      <div>
      <CardsListComponent events={events} onDelete={handleDeleteEvent} />

      </div>
      <div>
        <EventForm onEventCreated={handleEventCreated} />
      </div>
    </div>
  );
}

export default MyEventsPage;
