import { Button, Card, Image, Text, Box } from "@chakra-ui/react";
function CardComponent({ event, onDelete }) {
  const typeColor = event.type === "public" ? "green.500" : "red.500";

  return (
    <Box
      className="card-container"
      onClick={() => console.log(event)}
      maxW="sm"
      bg="white"
      boxShadow="lg"
      borderRadius="xl"
      p={5}
      transition="all 0.3s"
      _hover={{ transform: "scale(1.02)", boxShadow: "xl" }}
    >
      <Text fontSize="xl" fontWeight="bold" mb={1} color="gray.800">
        {event.title}
      </Text>
      <Text fontSize="md" color="gray.600" mb={3}>
        {event.description}
      </Text>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Text fontSize="sm" color="gray.500" mb={4}>
          {event.startDateTime
            ? new Date(event.startDateTime).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : event.startDate
            ? new Date(event.startDate).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </Text>

        <Text mb={1} color={typeColor} style={{ marginLeft: "auto" }}>
          {event.type}
        </Text>
      </div>

      <Box display="flex" gap="2">
        <Button colorScheme="blue" flex={1}>
          Join Event
        </Button>
        <Button variant="ghost" colorScheme="blue" color="gray" flex={1}>
          Add To Upcoming
        </Button>
        <Button
          variant="ghost"
          color="gray"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this event?")) {
              onDelete && onDelete(event);
            }
          }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
}

export default CardComponent;
