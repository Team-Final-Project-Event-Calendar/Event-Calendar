import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isOnHomepage = location.pathname === '/homepage';
  const isOnPublicPage = location.pathname === '/public';

  // Listen for clear search from homepage or public page
  useEffect(() => {
    const handleClearFromPage = () => {
      setQuery("");
    };

    window.addEventListener('clearNavSearch', handleClearFromPage);

    return () => {
      window.removeEventListener('clearNavSearch', handleClearFromPage);
    };
  }, []);

  const filterEventsByTitle = (events, searchQuery, myEventsArray = [], participatingEventsArray = []) => {
    return events.filter((eventItem) => {
      const title = eventItem.title?.toLowerCase() || '';
      const titleMatches = searchQuery
        .toLowerCase()
        .split(" ")
        .some((word) => word && title.includes(word));

      if (!titleMatches) return false;

      // On public page, only return public events
      if (isOnPublicPage) {
        return eventItem.type === "public";
      }

      // On homepage or other pages, follow the original logic
      if (eventItem.type === "public") return true;

      if (eventItem.type === "private") {
        const isCreator = myEventsArray.some(e => e._id === eventItem._id);
        const isParticipant = participatingEventsArray.some(e => e._id === eventItem._id);
        return isCreator || isParticipant;
      }

      return false;
    });
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && query.trim() !== "") {

      // For non-homepage pages
      const token = localStorage.getItem("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        // For public page, only fetch and filter public events
        if (isOnPublicPage) {
          const publicRes = await axios.get(`${key}/api/events/public`);
          const freshPublicEvents = Array.isArray(publicRes.data) ? publicRes.data : [];
          const filteredResults = filterEventsByTitle(freshPublicEvents, query);

          // If on public page, send results via event
          window.dispatchEvent(new CustomEvent('homepageSearch', {
            detail: { results: filteredResults, term: query }
          }));
          setExpanded(false);
          setQuery("");
          return;
        }

        // For homepage or other pages, fetch all relevant events
        const publicRes = await axios.get(`${key}/api/events/public`);
        const freshPublicEvents = Array.isArray(publicRes.data) ? publicRes.data : [];

        let freshMyEvents = [];
        let freshParticipatingEvents = [];

        // Fetch user-specific events if logged in
        if (token) {
          try {
            const myEventsRes = await axios.get(`${key}/api/events`, { headers: authHeaders });
            freshMyEvents = Array.isArray(myEventsRes.data) ? myEventsRes.data : [];
          } catch (err) {
            console.error("Failed to fetch user events:", err);
            freshMyEvents = [];
          }
          try {
            const participatingRes = await axios.get(`${key}/api/events/participating`, { headers: authHeaders });
            freshParticipatingEvents = Array.isArray(participatingRes.data) ? participatingRes.data : [];
          } catch (err) {
            console.error("Failed to fetch participating events:", err);
            freshParticipatingEvents = [];
          }
        }

        // Combine and filter events
        const allEventsMap = new Map();
        [...freshPublicEvents, ...freshMyEvents, ...freshParticipatingEvents].forEach((event) => {
          if (event && event._id) {
            allEventsMap.set(event._id, event);
          }
        });
        const uniqueEvents = Array.from(allEventsMap.values());
        const filteredResults = filterEventsByTitle(uniqueEvents, query, freshMyEvents, freshParticipatingEvents);

        if (isOnHomepage) {
          // If on homepage, send results via event
          window.dispatchEvent(new CustomEvent('homepageSearch', {
            detail: { results: filteredResults, term: query }
          }));
          setExpanded(false);
          setQuery("");
        } else {
          // If on other pages, navigate to homepage with search results
           setQuery("");
          navigate('/homepage', {
            state: {
              searchResults: filteredResults,
              searchTerm: query
            }
          });
        }

      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim() === "") {

      // Clear search if on homepage or public page
      if (isOnHomepage || isOnPublicPage) {
        window.dispatchEvent(new CustomEvent('homepageClearSearch'));
      }
    }
  };

   const handleBlur = () => {
    setTimeout(() => {
      setExpanded(false);
      // clear the input when clicking away
      setQuery("");
    }, 150);
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <input className="searchbar-field"
        type="text"
        value={query}
        placeholder="Search for events..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setExpanded(true)}
        onBlur={handleBlur}
        style={{
          width: expanded ? "75%" : 255,
          transition: "width 0.3s",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          border: "2px solid #1976d2",
          borderRadius: 8,
          outline: "none",
          background: "white",
          color: "#111",
        }}
      />
    </div>
  );
};

export default Searchbar;