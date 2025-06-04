import "../PublicPage/PublicPage.css";
import { Box } from "@chakra-ui/react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import { useState, useEffect } from "react";
const key = import.meta.env.VITE_API_URL || "http://localhost:5000";
function HomePage() {
  const [publicEvents, setPublicEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const authHeaders = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    // Fetch all public events
    fetch(`${key}/api/events/public`)
      .then((res) => res.json())
      .then((data) => setPublicEvents(data))
      .catch((err) => console.error("Failed to fetch public events:", err));

    // Fetch events created by the user
    fetch(`${key}/api/events`, { headers: authHeaders })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => Array.isArray(data) ? setMyEvents(data) : setMyEvents([]))
      .catch((err) => {
        setMyEvents([]);
        console.error("Failed to fetch my events:", err);
      });

    // Fetch events where user is a participant
    fetch(`${key}/api/events/participating`, { headers: authHeaders })
      .then((res) => res.ok ? res.json() : [])
      .then((data) => Array.isArray(data) ? setParticipatingEvents(data) : setParticipatingEvents([]))
      .catch((err) => {
        setParticipatingEvents([]);
        console.error("Failed to fetch participating events:", err);
      });
  }, []);

  // Iterate through all events to remove "duplicated" events
  const allEventsMap = new Map();
  [...publicEvents, ...myEvents, ...participatingEvents].forEach(event => {
    if (event && event._id) {
      allEventsMap.set(event._id, event);
    }
  });
  const uniqueEvents = Array.from(allEventsMap.values());

  return (
    <>

      <div className="public-Events-container">
        <Box className="public-events-chakra_Box" borderRadius="xl">
          <h2 className="public-events-chakra_Box-title">
            All Events
          </h2>
          <span className="public-events-chakra_Box-list">
            <CardsListComponent events={uniqueEvents} />
          </span>
        </Box>
      </div >

    </>
  )
}

export default HomePage;
