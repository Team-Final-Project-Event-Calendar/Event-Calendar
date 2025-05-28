import React from "react";
import { Avatar, Button, Card } from "@chakra-ui/react";
import CardComponent from "../CardComponent/CardComponent";

function CardsListComponent() {
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
      {Array.from({ length: 10 }).map((el) => (
        <CardComponent></CardComponent>
      ))}
    </div>
  );
}

export default CardsListComponent;
