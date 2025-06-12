import { Button, Image, Text, Box, useDisclosure } from "@chakra-ui/react";
import "./CardComponent.css";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Authentication/AuthContext";
import axios from "axios";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

function CardComponent({ event, onDelete }) {
  const { user } = useContext(AuthContext);
  const { onOpen } = useDisclosure();
  const [isInviteVisible, setIsInviteVisible] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [feedback, setFeedback] = useState("");
  const [users, setUsers] = useState([]);
  const [isJoining, setIsJoining] = useState(false);
  const typeColor = event.type === "public" ? "green.500" : "red.500";

  const handleInvite = async () => {
    try {
      if (users.length === 0) {
        const response = await axios.get(`${key}/api/auth/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      }
      setIsInviteVisible((prev) => !prev);
      setFeedback("");
      setSelectedUsername("");
    } catch (error) {
      setFeedback("Failed to load users");
      console.error(error);
    }
  };

  const handleSendInvite = async () => {
    if (!selectedUsername) {
      setFeedback("Please select a username");
      return;
    }

    try {
      const response = await axios.post(
        `${key}/api/events/${event._id}/participants`,
        { username: selectedUsername },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFeedback(
        response.data.message || `Invite sent to ${selectedUsername}!`
      );
      setSelectedUsername("");
      setIsInviteVisible(false);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send invite";
      setFeedback(msg);
      console.error(error);
    }
  };

  const handleEventJoin = async () => {
    const token = localStorage.getItem("token");
    if (!user) {
      alert("Please log in to join this event.");
      return;
    }

    if (event.participants?.some((p) => p === user._id || p._id === user._id)) {
      alert("You are already a participant in this event.");
      return;
    }

    setIsJoining(true);
    try {
      const response = await axios.post(`${key}/api/events/${event._id}/join`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("You have successfully joined the event!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.error || "Failed to join event.";
      alert(message);
    } finally {
      setIsJoining(false);
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

      <Text fontSize="sm" color="blue.500" mb={1} ml={2}>
        <Link
          to={`/eventdetails/${event._id || event.title + event.startDateTime}`}
        >
          See Details
        </Link>
      </Text>

      <Text fontSize="md" color="gray.600" mb={3}>
        {event.description}
      </Text>

      <Box display="flex" alignItems="center">
        <Text fontSize="sm" color="gray.500" mb={4}>
          {(event.startDateTime || event.startDate) &&
            new Date(event.startDateTime || event.startDate).toLocaleString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
        </Text>

        <Text mb={1} color={typeColor} ml="auto">
          {event.type}
        </Text>
      </Box>

      <Box display="flex" gap={2} mt={3}>
        {user && user._id === event.userId ? (
          <Box width="100%">
            <Button
              variant="ghost"
              color="gray"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
                handleInvite();
              }}
            >
              Invite
            </Button>

            {isInviteVisible && (
              <Box
                className="invite-form"
                display="flex"
                alignItems="center"
                flexDirection="column"
                gap="8px"
                p="8px"
                bg="#f1f1f1"
                border="1px solid #ccc"
                borderRadius="6px"
                boxShadow="sm"
                mt="10px"
                width="100%"
              >
                <select
                  value={selectedUsername}
                  onChange={(e) => {
                    setSelectedUsername(e.target.value);
                    setFeedback("");
                  }}
                  style={{
                    width: "100%",
                    padding: "6px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px",
                    color: "black",
                  }}
                >
                  <option value="" disabled>
                    Select username
                  </option>
                  {users.map((u) => (
                    <option key={u._id} value={u.username}>
                      {u.username}
                    </option>
                  ))}
                </select>

                <Button
                  variant="solid"
                  colorScheme="blue"
                  size="sm"
                  onClick={handleSendInvite}
                  isDisabled={!selectedUsername}
                >
                  Send
                </Button>

                {feedback && <Text color="red.500">{feedback}</Text>}
              </Box>
            )}
          </Box>
        ) : (
          <Button colorScheme="blue" flex={1} onClick={handleEventJoin} isLoading={isJoining}>
            Join Event
          </Button>
        )}


        {user && user._id === event.userId && (
          <Button
            variant="ghost"
            color="gray"
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm("Are you sure you want to delete this event?")
              ) {
                onDelete?.(event);
              }
            }}
          >
            Delete
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default CardComponent;
