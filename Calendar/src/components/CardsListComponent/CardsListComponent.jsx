/**
 * @file CardsListComponent.jsx
 * @description A React component that renders a list of event cards using the `CardComponent`.
 */

import React from "react";
import CardComponent from "../CardComponent/CardComponent";
import "./CardsListComponent.css";

/**
 * @function CardsListComponent
 * @description Renders a list of event cards with customizable layout options.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.events - An array of event objects to display.
 * @param {Function} props.onDelete - Callback function triggered when an event is deleted.
 * @param {string} [props.justify="flex-start"] - The CSS `justify-content` property for the layout.
 * @param {string} [props.maxWidth="60vw"] - The maximum width of the container.
 * @returns {JSX.Element} The rendered list of event cards.
 */
function CardsListComponent({
  events = [],
  onDelete,
  justify = "flex-start",
  maxWidth = "60vw",
}) {

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
            <CardComponent event={event} onDelete={onDelete} />
          </div>
        ))
      )}
    </div>
  );
}

export default CardsListComponent;
