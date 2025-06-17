import React, { useEffect, useState } from "react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import EventForm from "../../components/EventForm/EventForm";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./MyEventsPage.css";
import { Tabs, Box } from "@chakra-ui/react";
import { CustomSpinner } from "../PublicPage/PublicPage";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

function MyEventsPage() {
  const [myEvents, setMyEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Fetch my events
        const myResponse = await fetch(`${key}/api/events/mine`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!myResponse.ok) {
          throw new Error("Failed to fetch my events");
        }

        const myData = await myResponse.json();
        setMyEvents(myData);

        // Fetch participating events
        const participatingResponse = await fetch(
          `${key}/api/events/participating`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!participatingResponse.ok) {
          throw new Error("Failed to fetch participating events");
        }

        const participatingData = await participatingResponse.json();
        const markedParticipatingData = participatingData.map((event) => ({
          ...event,
          isUserParticipant: true, // Add a special flag
        }));
        setParticipatingEvents(markedParticipatingData);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Custom useEffect to handle handleLeaveEvent custom notify window in CardComponent.jsx
  useEffect(() => {
    // Listen for the eventLeft custom event
    const handleEventLeft = (e) => {
      const { eventId } = e.detail;
      // Filter out the left event from participatingEvents
      setParticipatingEvents((prev) =>
        prev.filter((event) => event._id !== eventId)
      );
    };

    window.addEventListener("eventLeft", handleEventLeft);
    // Clean up event listener
    return () => {
      window.removeEventListener("eventLeft", handleEventLeft);
    };
  }, []);

  const handleEventCreated = (newEvent) => {
    setMyEvents((prev) => [newEvent, ...prev]);
    toast.success("Event created successfully!");
  };

  const handleDeleteEvent = async (event) => {
    if (!event._id) return;
    try {
      await axios.delete(`${key}/api/events/${event._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMyEvents((prev) => prev.filter((e) => e._id !== event._id));
      toast.success(`Event successfully deleted`);
    } catch (err) {
      alert("Failed to delete event");
      toast.error(err);
    }
  };

  return (
    <div className="myevents-container-with-tabs">
      <h1 className="myevents-title-h1">Manage & Create Your Events</h1>

      <Box
        width="60vw"
        mx="auto"
        mt={3}
        backgroundColor={"#f9f9f9"}
        borderRadius="md"
        boxShadow="md"
        minH={"850px"}
      >
        <Tabs.Root defaultValue="myEvents">
          <Tabs.List bg="#f8f3f3" justifyContent="center" p={"2"}>
            <Tabs.Trigger value="myEvents" fontSize={"18px"} fw={"bold"}>
              My Events
            </Tabs.Trigger>
            <Tabs.Trigger
              value="create"
              fontSize={"24px"}
              fw="bold"
              backgroundColor="#5565DD"
              borderRadius="22px"
              color="#fff"
              _hover={{ backgroundColor: "#4454BB" }}
            >
              Create Event
            </Tabs.Trigger>
            <Tabs.Trigger value="participating" fontSize={"18px"} fw={"bold"}>
              Participating
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="myEvents" p={4}>
            {isLoading ? (
              <CustomSpinner />
            ) : myEvents.length > 0 ? (
              <CardsListComponent
                events={myEvents}
                onDelete={handleDeleteEvent}
                maxWidth="100%"
                justify="center"
              />
            ) : (
              <p>You haven't created any events yet.</p>
            )}
          </Tabs.Content>

          <Tabs.Content value="participating" p={4}>
            {isLoading ? (
              <CustomSpinner />
            ) : participatingEvents.length > 0 ? (
              <CardsListComponent
                events={participatingEvents}
                showCreator={true}
                maxWidth="100%"
                justify="center"
              />
            ) : (
              <p>You're not participating in any events yet.</p>
            )}
          </Tabs.Content>

          <Tabs.Content value="create" p={4}>
            <Box
              maxWidth="19vw"
              mx="auto"
              p={4}
              backgroundColor="#fff"
              borderRadius="md"
              boxShadow="md"
            >
              <EventForm onEventCreated={handleEventCreated} />
            </Box>
          </Tabs.Content>
        </Tabs.Root>
      </Box>

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default MyEventsPage;
