import React, { useEffect, useState } from "react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import EventForm from "../../components/EventForm/EventForm";

function MyEventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events", {
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

  // Handler to add a new event to the list
  const handleEventCreated = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  return (
    <div
      className="w-60"
      style={{
        display: "flex",
        gap: "50px",
        margin: "50px auto",
        justifyContent: "space-between",
        width: "60wv",
      }}
    >
      <div>
        <CardsListComponent events={events} />
      </div>
      <div>
        <EventForm onEventCreated={handleEventCreated} />
      </div>
    </div>
  );
}

export default MyEventsPage;
