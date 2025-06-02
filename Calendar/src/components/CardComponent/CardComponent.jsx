import { Button, Card, Image, Text, Box } from "@chakra-ui/react";
function CardComponent({ event, onDelete }) {
  return (
    <Box
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
      <Text fontSize="sm" color="gray.500" mb={4}>
        {new Date(event.startDate).toLocaleString()}
      </Text>

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
            onDelete && onDelete(event);
          }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
}

export default CardComponent;
