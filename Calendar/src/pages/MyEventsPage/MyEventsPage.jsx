import React, { useEffect, useState } from "react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import EventForm from "../../components/EventForm/EventForm";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./MyEventsPage.css";
import { Tabs, Box, } from "@chakra-ui/react";
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
        const participatingResponse = await fetch(`${key}/api/events/participating`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!participatingResponse.ok) {
          throw new Error("Failed to fetch participating events");
        }

        const participatingData = await participatingResponse.json();
        setParticipatingEvents(participatingData);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
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

  const handleLeaveEvent = async (event) => {
    if (!event._id) return;
    try {
      await axios.delete(`${key}/api/events/${event._id}/leave`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setParticipatingEvents((prev) => prev.filter((e) => e._id !== event._id));
      toast.success(`Left event successfully`);
    } catch (err) {
      toast.error("Failed to leave event");
      console.error(err);
    }
  };

  return (
    <div className="myevents-container-with-tabs">
      <h1 className="myevents-title-h1">Manage & Create Your Events</h1>

      <Box width="60vw" mx="auto" mt={3} backgroundColor={"#f9f9f9"} borderRadius="md" boxShadow="md">
        <Tabs.Root defaultValue="myEvents">
          <Tabs.List>
            <Tabs.Trigger value="myEvents" fontSize={"18px"}>
              My Events
            </Tabs.Trigger>
            <Tabs.Trigger value="participating" fontSize={"18px"}>
              Participating Events
            </Tabs.Trigger>
            <Tabs.Trigger value="create" fontSize={"22px"} >
              Create Event
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="myEvents" p={4}>
            {isLoading ? (
              <p><CustomSpinner/></p>
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
              <p><CustomSpinner/></p>
            ) : participatingEvents.length > 0 ? (
              <CardsListComponent
                events={participatingEvents}
                actionLabel="Leave"
                onAction={handleLeaveEvent}
                showCreator={true}
                maxWidth="100%"
                justify="center"
              />
            ) : (
              <p>You're not participating in any events yet.</p>
            )}
          </Tabs.Content>

          <Tabs.Content value="create" p={4}>
            <Box justifyItems="center"  width="100%" >
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