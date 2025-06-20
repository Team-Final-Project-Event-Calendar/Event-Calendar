/**
 * @file CardsListComponent.jsx
 * @description A React component that renders a list of event cards using the `CardComponent`. It displays events in a responsive grid layout.
 */

import React from "react";
import { Avatar, Button, Card } from "@chakra-ui/react";
import CardComponent from "../CardComponent/CardComponent";

/**
 * @function CardsListComponent
 * @description Renders a list of event cards in a flexible grid layout.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.events - An array of event objects to display. Each event is passed to the `CardComponent`.
 * @returns {JSX.Element} The rendered CardsListComponent.
 */
function CardsListComponent({ events = [] }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        maxWidth: "70vw",
        margin: "0 auto",
        gap: "20px",
        justifyContent: "center",
      }}
    >
      {Array.isArray(events) &&
        events.map((event, index) => (
          <CardComponent key={event._id || index} event={event} />
        ))}
    </div>
  );
}

export default CardsListComponent;