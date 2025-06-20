/**
 * @file MyEventsPage.jsx
 * @description A React component that displays the user's created events and events they are participating in. It provides functionality for creating, deleting, and managing events.
 */

import React, { useEffect, useState } from "react";
import CardsListComponent from "../../components/CardsListComponent/CardsListComponent";
import EventForm from "../../components/EventForm/EventForm";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "./MyEventsPage.css";
import { Tabs, Box } from "@chakra-ui/react";
import { CustomSpinner } from "../PublicPage/PublicPage";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

/**
 * @function MyEventsPage
 * @description Displays the user's created events and events they are participating in. Allows users to create, delete, and manage events.
 * @returns {JSX.Element} The rendered MyEventsPage component.
 */
function MyEventsPage() {
  /**
   * @constant {Array<Object>} myEvents
   * @description The list of events created by the logged-in user.
   */
  const [myEvents, setMyEvents] = useState([]);

  /**
   * @constant {Array<Object>} participatingEvents
   * @description The list of events the logged-in user is participating in.
   */
  const [participatingEvents, setParticipatingEvents] = useState([]);

  /**
   * @constant {boolean} isLoading
   * @description Indicates whether the events are being loaded.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @constant {boolean} showCreateForm
   * @description Indicates whether the event creation form is visible.
   */
  const [showCreateForm, setShowCreateForm] = useState(false);

  /**
   * @function useEffect
   * @description Fetches the user's created events and participating events from the backend when the component mounts.
   * @async
   */
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
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
          isUserParticipant: true,
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

  /**
   * @function useEffect
   * @description Listens for the "eventLeft" custom event and removes the event from the participating events list.
   */
  useEffect(() => {
    const handleEventLeft = (e) => {
      const { eventId } = e.detail;
      setParticipatingEvents((prev) =>
        prev.filter((event) => event._id !== eventId)
      );
    };

    window.addEventListener("eventLeft", handleEventLeft);
    return () => {
      window.removeEventListener("eventLeft", handleEventLeft);
    };
  }, []);

  /**
   * @function handleEventCreated
   * @description Adds a newly created event to the user's events list.
   * @param {Object} newEvent - The newly created event.
   */
  const handleEventCreated = (newEvent) => {
    setMyEvents((prev) => [newEvent, ...prev]);
    toast.success("Event created successfully!");
  };

  /**
   * @function handleDeleteEvent
   * @description Deletes an event created by the user and updates the events list.
   * @param {Object} event - The event to delete.
   * @async
   */
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
    <>
      <div
        className={`myevents-container-with-tabs ${
          showCreateForm ? "blurred" : ""
        }`}
      >
        <h1 className="myevents-title-h1">Manage & Create Your Events</h1>

        <Box
          className="myevents-box-container-tabs"
          width="60vw"
          mx="auto"
          mt={3}
          backgroundColor={"#f9f9f9"}
          borderRadius="md"
          boxShadow="md"
          minH={"850px"}
        >
          <Tabs.Root defaultValue="myEvents">
            <Tabs.List
              className="myevents-box-container-tablist"
              bg="#f8f3f3"
              justifyContent="center"
              p={"2"}
            >
              <Tabs.Trigger value="myEvents" fontSize={"18px"} fw={"bold"}>
                My Events
              </Tabs.Trigger>

              <button
                onClick={() => setShowCreateForm(true)}
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  backgroundColor: "#5565DD",
                  borderRadius: "22px",
                  color: "#fff",
                  padding: "0.5rem 1.5rem",
                  margin: "0 1rem",
                  cursor: "pointer",
                }}
              >
                Create Event
              </button>

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
          </Tabs.Root>
        </Box>

        <ToastContainer position="bottom-right" />
      </div>

      {showCreateForm && (
        <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <EventForm
              onEventCreated={(newEvent) => {
                handleEventCreated(newEvent);
                setShowCreateForm(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default MyEventsPage;
