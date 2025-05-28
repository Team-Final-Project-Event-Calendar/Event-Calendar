import { Badge, Box, Button, Card, HStack, Image } from "@chakra-ui/react";

function CardComponent() {
  return (
    <Card.Root flexDirection="row" overflow="hidden" maxW="xl">
      <Image
        objectFit="cover"
        maxW="200px"
        src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
        alt="Caffe Latte"
      />
      <Box>
        <Card.Body>
          <Card.Title mb="2">Current Event</Card.Title>
          <Card.Description>
            This Event is about something that will be verry interesting and
            will.
          </Card.Description>
          <HStack mt="4">
            <Badge>Event</Badge>
            <Badge>Hot</Badge>
            <Badge>Goes well with cigarete</Badge>
            <Badge>Caffeine</Badge>
          </HStack>
        </Card.Body>
        <Card.Footer>
          <Button>Join Event</Button>
          <Button>Add to favorites</Button>
          <Button>Like</Button>
        </Card.Footer>
      </Box>
    </Card.Root>
  );
}

export default CardComponent;
