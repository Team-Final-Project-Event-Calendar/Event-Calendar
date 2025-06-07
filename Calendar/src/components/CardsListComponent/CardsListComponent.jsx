import React from "react";
import CardComponent from "../CardComponent/CardComponent";
import "./CardsListComponent.css";

function CardsListComponent({ events = [], onDelete }) {
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
            <CardComponent event={event} onDelete={onDelete} />
          </div>
        ))
      )}
    </div>
  );
}

export default CardsListComponent;
