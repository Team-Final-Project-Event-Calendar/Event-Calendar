import "../PublicPage/PublicPage.css";
import { Box, Heading, Text } from "@chakra-ui/react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import { useState, useEffect, useMemo } from "react";
import "./HomePage.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

function HomePage() {
  const [publicEvents, setPublicEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation()

  const handleDeleteEvent = async (event) => {
    if (!event._id) return;
    try {
      await axios.delete(`${key}/api/events/${event._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMyEvents((prev) => prev.filter((e) => e._id !== event._id));

      if (searchResults) {
        setSearchResults((prev) => prev.filter((e) => e._id !== event._id));
      }
    } catch (err) {
      alert("Failed to delete event");
      console.error(err);
    }
  };

    useEffect(() => {
    if (location.state?.searchResults && location.state?.searchTerm) {
      setSearchResults(location.state.searchResults);
      setSearchTerm(location.state.searchTerm);
      // Clear the navigation state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Listen for search events from NavComponent
  useEffect(() => {
    const handleGlobalSearch = (event) => {
      const { results, term } = event.detail;
      setSearchResults(results);
      setSearchTerm(term);
    };

    const handleGlobalClearSearch = () => {
      setSearchResults(null);
      setSearchTerm("");
    };

    window.addEventListener('homepageSearch', handleGlobalSearch);
    window.addEventListener('homepageClearSearch', handleGlobalClearSearch);

    return () => {
      window.removeEventListener('homepageSearch', handleGlobalSearch);
      window.removeEventListener('homepageClearSearch', handleGlobalClearSearch);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    // Fetch all public events
    fetch(`${key}/api/events/public`)
      .then((res) => res.json())
      .then((data) => Array.isArray(data) ? setPublicEvents(data) : setPublicEvents([]))
      .catch((err) => {
        setPublicEvents([]);
        console.error("Failed to fetch public events:", err);
      });

    // Fetch events created by the user
    if (token) {
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
        .then((res) => {
          if (res.status === 500) {
            // Get the actual error message from the server
            return res.json().then(errorData => {
              console.error("500 Error details:", errorData);
              setParticipatingEvents([]);
              return [];
            }).catch(() => {

              setParticipatingEvents([]);
              return [];
            });
          }

          if (res.status === 403) {
            setParticipatingEvents([]);
            return [];
          }
          return res.ok ? res.json() : [];
        })
        .then((data) => {
          console.log("Participating events data:", data);
          Array.isArray(data)
            ? setParticipatingEvents(data)
            : setParticipatingEvents([]);
        })
        .catch((err) => {
          console.error("Participating events fetch error:", err);
          setParticipatingEvents([]);
        });
    } else {
      setMyEvents([]);
      setParticipatingEvents([]);
    }

  }, []);

  // Iterate through all events to remove "duplicated" events
  const uniqueEvents = useMemo(() => {
    const allEventsMap = new Map();
    [...publicEvents, ...myEvents, ...participatingEvents].forEach((event) => {
      if (event && event._id) {
        allEventsMap.set(event._id, event);
      }
    });
    return Array.from(allEventsMap.values());
  }, [publicEvents, myEvents, participatingEvents]);

  // Determine what events to display
  const eventsToDisplay = searchResults !== null ? searchResults : uniqueEvents;
  const displayTitle = searchResults !== null
    ? `Search Results for "${searchTerm}"`
    : "All Events";

  const clearSearch = () => {
    setSearchResults(null);
    setSearchTerm("");
    // Also clear the search in NavComponent
    window.dispatchEvent(new CustomEvent('clearNavSearch'));
  };


  return (
    <div className="home-page-container">
      <Heading as="h1" size="xl" textAlign="center" mb={8} color="#1976d2">
        Welcome to Event Calendar
      </Heading>
      <Text textAlign="center" fontSize="lg" mb={12} color="#555">
        Discover and manage events effortlessly
      </Text>

      <div
        className="public-events-container"
        style={{ display: "flex", alignItems: "center" }}
      >
        <Box
          justifyItems={"center"}
          className="public-events-box"
          borderRadius="xl"
          style={{ width: "80vw", margin: "0 auto" }}
          p={6}
          bg="#f7f7f7"
          boxShadow="0 4px 24px rgba(0,0,0,0.1)"
        >
          <Heading as="h2" size="lg" mb={4} color="#1976d2" textAlign="center">
            {displayTitle}
            {searchResults !== null && (
              <button
                onClick={clearSearch}
                style={{
                  marginLeft: "1rem",
                  background: "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                Clear
              </button>
            )}
          </Heading>

          {eventsToDisplay.length > 0 ? (
            <CardsListComponent
              events={eventsToDisplay}
              onDelete={handleDeleteEvent}
              justify="center"
            />
          ) : (
            <Text textAlign="center" color="#666">
              {searchResults !== null
                ? `No events found for "${searchTerm}"`
                : "No events available"
              }
            </Text>
          )}
        </Box>
      </div>
    </div>
  );
}

export default HomePage;
