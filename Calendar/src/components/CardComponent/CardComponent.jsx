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
import axios from "axios";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

function CardComponent({ event, onDelete }) {
  const { user } = useContext(AuthContext);
  const { onOpen } = useDisclosure();
  const [isInviteVisible, setIsInviteVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [feedback, setFeedback] = useState("");

  const typeColor = event.type === "public" ? "green.500" : "red.500";

  const handleInvite = () => {
    setIsInviteVisible(!isInviteVisible);
  };

  const handleSendInvite = async () => {
    try {
      console.log(event._id);
      const response = await axios.post(
        `${key}/api/events/invite/${event._id}`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("API REQUEST SEND");
      setFeedback(response.data.message || "User invited successfully!");
      setUsername("");
    } catch (error) {
      if (error.response?.data?.message) {
        setFeedback(error.response.data.message);
      } else {
        setFeedback("An error occurred. Please try again.");
      }
    }
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
          <Box width="100%">
            <Button
              variant="ghost"
              color="grey"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
                handleInvite(); // just toggle the invite form
              }}
            >
              Invite
            </Button>

            {isInviteVisible && (
              <Box
                className="invite-form"
                display="flex"
                alignItems="center"
                gap="8px"
                p="8px"
                bg="#f1f1f1"
                border="1px solid #ccc"
                borderRadius="6px"
                boxShadow="sm"
                mt="10px"
                width="100%"
                flexDirection="column"
              >
                <input
                  type="text"
                  placeholder="Type username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setFeedback(""); // clear error when typing
                  }}
                  style={{
                    width: "100%",
                    padding: "6px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                    color: "white",
                  }}
                />
                <Button
                  variant="solid"
                  colorScheme="blue"
                  size="sm"
                  onClick={handleSendInvite}
                  isDisabled={!username.trim()}
                >
                  Send
                </Button>
                {feedback && <Text color="red.500">{feedback}</Text>}
              </Box>
            )}
          </Box>
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
