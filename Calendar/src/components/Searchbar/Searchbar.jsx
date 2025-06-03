import { useState } from "react";
import axios from "axios";
import CardsListComponent from "../CardsListComponent/CardsListComponent";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [events, setEvents] = useState([]);

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      setSearchTerm(query);
      const token = localStorage.getItem("token");
      const url = token
        ? "http://localhost:5000/api/events"
        : "http://localhost:5000/api/events/public";
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      try {
        const res = await axios.get(url, { headers });
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim() === "") {
      setSearchTerm("");
      setEvents([]);
    }
  };

  const filteredResults =
    searchTerm.trim() === ""
      ? []
      : events.filter((event) => {
          const title = event.title.toLowerCase();
          return searchTerm
            .toLowerCase()
            .split(" ")
            .some((word) => word && title.includes(word));
        });

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        value={query}
        placeholder="Search for events..."
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setExpanded(true)}
        onBlur={() => setTimeout(() => setExpanded(false), 150)}
        style={{
          width: expanded ? "100%" : 255,
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
      {expanded && searchTerm.trim() !== "" && (
        <div
          style={{
            marginTop: "100px",
            display: "flex",
            width: expanded ? "60vw" : 180,
            background: "#e3f2fd",
            border: "1.5px solid #90caf9",
            borderRadius: 8,
            boxShadow: "0 2px 8px #e3f2fd",
            padding: "0.5rem 1rem",
            textAlign: "left",
            zIndex: 10,
            position: "absolute",
            color: "#111",
          }}
        >
          {filteredResults.length > 0 ? (
            // <>
            //   <div
            //     style={{
            //       fontWeight: 500,
            //       marginBottom: 4,
            //       alignItems: "center",
            //     }}
            //   >
            //     Results for:{" "}
            //     <span style={{ color: "#1976d2" }}>{searchTerm}</span>
            //   </div>

            //   {filteredResults.map((event, idx) => (
            //     <div key={event._id || idx}>{event.title}</div>
            //   ))}
            // </>

            <CardsListComponent events={filteredResults}></CardsListComponent>
          ) : (
            <div
              style={{ fontWeight: 400, marginBottom: 4, alignItems: "center" }}
            >
              No results found for:{" "}
              <span style={{ color: "#d32f2f" }}>{searchTerm}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
