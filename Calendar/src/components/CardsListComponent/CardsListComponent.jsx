import React from "react";
import CardComponent from "../CardComponent/CardComponent";
import "./CardsListComponent.css";
function CardsListComponent({ events = [] }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        maxWidth: "70vw",
        margin: "0 auto",
        gap: "20px",
        justifyContent: "flex-start",
      }}
    >
      {events.length === 0 ? (
        <div style={{ color: "#888", fontSize: 18 }}>No events yet.</div>
      ) : (
        events.map((event) => (
          <div key={event._id || event.title + event.startDateTime}>
            <div
              className="card-container"
              style={{
                borderRadius: 12,
                boxShadow: "0 2px 8px #e0e0e0",
                padding: 18,
                minWidth: 220,
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 20 }}>{event.title}</div>
              <div style={{ color: "#1976d2", fontSize: 15 }}>{event.type}</div>
              <div style={{ fontSize: 14 }}>{event.description}</div>
              <div style={{ fontSize: 13, color: "#888" }}>
                {event.startDateTime
                  ? new Date(event.startDateTime).toLocaleString()
                  : ""}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CardsListComponent;
