import { Button, Card, Image, Text } from "@chakra-ui/react";

function CardComponent({ event }) {
  return (
    <Card.Root maxW="sm" overflow="hidden">
      {/* <Image
        src="https://images.prismic.io/wildgoose/3a553239-8fde-489a-9ae2-cda33cee940b_team-meeting-games-for-the-office.webp?auto=compress,format"
        alt="Green double couch with wooden legs"
      /> */}
      <Card.Body gap="2">
        <Card.Title>{event.title}</Card.Title>
        <Card.Description>{event.description}</Card.Description>
        <Text textStyle="2xl" fontWeight="medium" letterSpacing="tight" mt="2">
          {event.startDate}
        </Text>
      </Card.Body>
      <Card.Footer gap="2">
        <Button variant="solid">Join Event</Button>
        <Button variant="ghost">Add To Upcoming</Button>
      </Card.Footer>
    </Card.Root>
  );
}

export default CardComponent;
