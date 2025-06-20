/**
 * @file CardComponent.jsx
 * @description A React component that displays an event card with details such as title, description, and start date. It includes actions like joining the event or adding it to upcoming events.
 */

import { Button, Card, Image, Text } from "@chakra-ui/react";

/**
 * @function CardComponent
 * @description Renders a card displaying event details and action buttons.
 * @param {Object} props - The component props.
 * @param {Object} props.event - The event object containing details to display.
 * @param {string} props.event.title - The title of the event.
 * @param {string} props.event.description - The description of the event.
 * @param {string} props.event.startDate - The start date of the event.
 * @returns {JSX.Element} The rendered CardComponent.
 */
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