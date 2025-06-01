import React from "react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import EventForm from "../../components/EventForm/EventForm";

function MyEventsPage() {
  return (
    <div
      className="w-60"
      style={{ display: "flex", gap: "50px", margin: "50px auto" }}
    >
      <div>
        <CardsListComponent></CardsListComponent>
      </div>
      <div>
        <EventForm></EventForm>
      </div>
    </div>
  );
}

export default MyEventsPage;
