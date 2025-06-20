/**
 * @file Searchbar.jsx
 * @description A React component that provides a search bar for filtering and navigating events. It supports public and private events, and handles search results differently based on the current page.
 */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

/**
 * @function Searchbar
 * @description A search bar component for filtering and navigating events. It listens for custom events to clear the search and handles search results differently based on the current page.
 * @returns {JSX.Element} The rendered Searchbar component.
 */
const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isOnHomepage = location.pathname === "/homepage";
  const isOnPublicPage = location.pathname === "/public";

  /**
   * @function useEffect
   * @description Listens for the `clearNavSearch` custom event to clear the search query.
   */
  useEffect(() => {
    const handleClearFromPage = () => {
      setQuery("");
    };

    window.addEventListener("clearNavSearch", handleClearFromPage);

    return () => {
      window.removeEventListener("clearNavSearch", handleClearFromPage);
    };
  }, []);

  /**
   * @function filterEventsByTitle
   * @description Filters events based on the search query and the current page's context.
   * @param {Array<Object>} events - The list of events to filter.
   * @param {string} searchQuery - The search query entered by the user.
   * @param {Array<Object>} [myEventsArray=[]] - The user's created events.
   * @param {Array<Object>} [participatingEventsArray=[]] - The events the user is participating in.
   * @returns {Array<Object>} The filtered list of events.
   */
  const filterEventsByTitle = (events, searchQuery, myEventsArray = [], participatingEventsArray = []) => {
    return events.filter((eventItem) => {
      const title = eventItem.title?.toLowerCase() || "";
      const titleMatches = searchQuery
        .toLowerCase()
        .split(" ")
        .some((word) => word && title.includes(word));

      if (!titleMatches) return false;

      if (isOnPublicPage) {
        return eventItem.type === "public";
      }

      if (eventItem.type === "public") return true;

      if (eventItem.type === "private") {
        const isCreator = myEventsArray.some((e) => e._id === eventItem._id);
        const isParticipant = participatingEventsArray.some((e) => e._id === eventItem._id);
        return isCreator || isParticipant;
      }

      return false;
    });
  };

  /**
   * @function handleKeyDown
   * @description Handles the "Enter" key press to fetch and filter events based on the search query.
   * @param {Object} e - The keyboard event.
   * @async
   */
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      const token = localStorage.getItem("token");
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        if (isOnPublicPage) {
          const publicRes = await axios.get(`${key}/api/events/public`);
          const freshPublicEvents = Array.isArray(publicRes.data) ? publicRes.data : [];
          const filteredResults = filterEventsByTitle(freshPublicEvents, query);

          window.dispatchEvent(
            new CustomEvent("homepageSearch", {
              detail: { results: filteredResults, term: query },
            })
          );
          setExpanded(false);
          setQuery("");
          return;
        }

        const publicRes = await axios.get(`${key}/api/events/public`);
        const freshPublicEvents = Array.isArray(publicRes.data) ? publicRes.data : [];

        let freshMyEvents = [];
        let freshParticipatingEvents = [];

        if (token) {
          try {
            const myEventsRes = await axios.get(`${key}/api/events`, { headers: authHeaders });
            freshMyEvents = Array.isArray(myEventsRes.data) ? myEventsRes.data : [];
          } catch (err) {
            console.error("Failed to fetch user events:", err);
          }
          try {
            const participatingRes = await axios.get(`${key}/api/events/participating`, { headers: authHeaders });
            freshParticipatingEvents = Array.isArray(participatingRes.data) ? participatingRes.data : [];
          } catch (err) {
            console.error("Failed to fetch participating events:", err);
          }
        }

        const allEventsMap = new Map();
        [...freshPublicEvents, ...freshMyEvents, ...freshParticipatingEvents].forEach((event) => {
          if (event && event._id) {
            allEventsMap.set(event._id, event);
          }
        });
        const uniqueEvents = Array.from(allEventsMap.values());
        const filteredResults = filterEventsByTitle(uniqueEvents, query, freshMyEvents, freshParticipatingEvents);

        if (isOnHomepage) {
          window.dispatchEvent(
            new CustomEvent("homepageSearch", {
              detail: { results: filteredResults, term: query },
            })
          );
          setExpanded(false);
          setQuery("");
        } else {
          setQuery("");
          navigate("/homepage", {
            state: {
              searchResults: filteredResults,
              searchTerm: query,
            },
          });
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    }
  };

  /**
   * @function handleChange
   * @description Updates the search query and clears results if the query is empty.
   * @param {Object} e - The input change event.
   */
  const handleChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim() === "") {
      if (isOnHomepage || isOnPublicPage) {
        window.dispatchEvent(new CustomEvent("homepageClearSearch"));
      }
    }
  };

  /**
   * @function handleBlur
   * @description Handles the blur event to collapse the search bar and clear the query.
   */
  const handleBlur = () => {
    setTimeout(() => {
      setExpanded(false);
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