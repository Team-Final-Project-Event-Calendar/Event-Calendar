import React from "react";
import CardComponent from "../CardComponent/CardComponent";
import "./CardsListComponent.css";

function CardsListComponent({
  events = [],
  onDelete,
  onAction,
  actionLabel = "Delete",
  showCreator = false,
  justify = "flex-start",
  maxWidth = "60vw",
}) {
  const handleAction = (event) => {
    if (actionLabel === "Delete") {
      onDelete && onDelete(event);
    } else {
      onAction && onAction(event);
    }
  };
  return (
    <div className="cards-list-container123"
      style={{
        display: "flex",
        flexWrap: "wrap",
        maxWidth: maxWidth,
        margin: "0px auto",
        gap: "20px",
        justifyContent: justify,
      }}
    >
      {events.length === 0 ? (
        <div style={{ color: "#888", fontSize: 18 }}>No events yet.</div>
      ) : (
        events.map((event) => (
          <div key={event._id || event.title + event.startDateTime}>
            <CardComponent
              event={event}
              onDelete={handleAction}
              actionLabel={actionLabel}
              showCreator={showCreator}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default CardsListComponent;
