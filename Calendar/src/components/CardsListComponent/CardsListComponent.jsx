import CardComponent from "../CardComponent/CardComponent";

function CardsListComponent({ events = [] }) {
  return (
    <div
      style={{
        flexWrap: "wrap",
        display: "flex",
        maxWidth: "70vw",
        margin: "0 auto",
        gap: "20px",
      }}
    >
      {Array.isArray(events) &&
        events.map((event, index) => (
          <CardComponent key={event._id || index} event={event} />
        ))}
      {/* {Array.from({ length: 2 }).map((el) => (
        <CardComponent></CardComponent>
      ))} */}
    </div>
  );
}

export default CardsListComponent;
