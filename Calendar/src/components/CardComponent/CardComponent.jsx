import {
  Button,
  Card,
  Image,
  Text,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import "./CardComponent.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Authentication/AuthContext";
import { useState } from "react";
import { LuHand } from "react-icons/lu";

function CardComponent({ event, onDelete }) {
  const { user } = useContext(AuthContext);
  const { onOpen } = useDisclosure();
  const [isInviteVisible, setIsInviteVisible] = useState(false);

  const typeColor = event.type === "public" ? "green.500" : "red.500";

  const handleInvite = () => {
    setIsInviteVisible(!isInviteVisible);
  };
  return (
    <Box
      className="card-container"
      maxW="sm"
      minW="400px"
      bg="white"
      boxShadow="md"
      borderRadius="xl"
      p={5}
      transition="all 0.3s"
      _hover={{ transform: "scale(1.02)", boxShadow: "xl" }}
    >
      <Text fontSize="xl" fontWeight="bold" mb={1} color="gray.800">
        <Link
          to={`/eventdetails/${event._id || event.title + event.startDateTime}`}
        >
          {event.title}
        </Link>
      </Text>
      <Text fontSize="sm" color="blue" mb={1} ml={2}>
        <Link
          to={`/eventdetails/${event._id || event.title + event.startDateTime}`}
        >
          See Details
        </Link>
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
        {user && user._id === event.userId ? (
          <div>
            <Button
              variant="ghost"
              color="grey"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
                handleInvite();
              }}
            >
              Invite
            </Button>
            {isInviteVisible && (
              <div
                className="invite-form"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px",
                  backgroundColor: "#f1f1f1",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                <input
                  type="text"
                  placeholder="Type username"
                  style={{
                    flex: 1,
                    padding: "6px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    outline: "none",
                    fontSize: "14px",
                    color: "lightgrey",
                  }}
                />
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  size="sm"
                  style={{ padding: "6px 12px", color: "grey" }}
                >
                  Send
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Button colorScheme="blue" flex={1}>
            Join Event
          </Button>
        )}

        {user && user._id && event.userId === user._id ? (
          <Button
            variant="ghost"
            color="gray"
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm("Are you sure you want to delete this event?")
              ) {
                onDelete && onDelete(event);
              }
            }}
          >
            Delete
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}

export default CardComponent;
