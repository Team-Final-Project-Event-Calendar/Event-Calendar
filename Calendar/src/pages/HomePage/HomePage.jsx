import "../PublicPage/PublicPage.css";
import { Box, Heading, Text } from "@chakra-ui/react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import { useState, useEffect } from "react";
import "./HomePage.css";
const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";
import axios from "axios";

function HomePage() {
  const [publicEvents, setPublicEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);

  const handleDeleteEvent = async (event) => {
    if (!event._id) return;
    try {
      await axios.delete(`${key}/api/events/${event._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMyEvents((prev) => prev.filter((e) => e._id !== event._id));
    } catch (err) {
      alert("Failed to delete event");
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // Fetch all public events
    fetch(`${key}/api/events/public`)
      .then((res) => res.json())
      .then((data) => setPublicEvents(data))
      .catch((err) => console.error("Failed to fetch public events:", err));

    // Fetch events created by the user
    fetch(`${key}/api/events`, { headers: authHeaders })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) =>
        Array.isArray(data) ? setMyEvents(data) : setMyEvents([])
      )
      .catch((err) => {
        setMyEvents([]);
        console.error("Failed to fetch my events:", err);
      });

    // Fetch events where user is a participant
    fetch(`${key}/api/events/participating`, { headers: authHeaders })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) =>
        Array.isArray(data)
          ? setParticipatingEvents(data)
          : setParticipatingEvents([])
      )
      .catch((err) => {
        setParticipatingEvents([]);
        console.error("Failed to fetch participating events:", err);
      });
  }, [myEvents]);

  // Iterate through all events to remove "duplicated" events
  const allEventsMap = new Map();
  [...publicEvents, ...myEvents, ...participatingEvents].forEach((event) => {
    if (event && event._id) {
      allEventsMap.set(event._id, event);
    }
  });
  const uniqueEvents = Array.from(allEventsMap.values());

  return (
    <div className="home-page-container">
      <Heading as="h1" size="xl" textAlign="center" mb={8} color="#1976d2">
        Welcome to Event Calendar
      </Heading>
      <Text textAlign="center" fontSize="lg" mb={12} color="#555">
        Discover and manage events effortlessly
      </Text>
      <div className="public-events-container">
        <Box
          className="public-events-box"
          borderRadius="xl"
          style={{ width: "80vw", margin: "0 auto" }}
          p={6}
          bg="#f7f7f7"
          boxShadow="0 4px 24px rgba(0,0,0,0.1)"
        >
          <Heading as="h2" size="lg" mb={4} color="#1976d2" textAlign="center">
            All Events
          </Heading>
          <CardsListComponent
            events={uniqueEvents}
            onDelete={handleDeleteEvent}
          />
        </Box>
      </div>
    </div>
  );
}

export default HomePage;
