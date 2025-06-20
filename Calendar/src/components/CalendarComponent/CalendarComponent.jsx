import React, { useState } from "react";
import CalendarMatrix from "./CalendarMatrix";
import "./Calendar.css";
import EventForm from "../EventForm/EventForm";

/**
 * CalendarComponent is a React component that displays a calendar with
 * month/week/day/workWeek views, allows navigation between dates, and supports
 * creating and viewing events.
 * 
 * @component
 * @returns {JSX.Element} The rendered calendar component.
 * 
 * @example
 * return <CalendarComponent />;
 * 
 * @typedef {Object} Event
 * @property {string} id - Unique identifier for the event.
 * @property {Date|string} date - The date of the event (for all-day events).
 * @property {Date|string} startDateTime - The start date and time of the event.
 * @property {string} title - Title or description of the event.
 * // add other properties as needed
 * 
 * @state {Date} currentDate - The currently focused date in the calendar.
 * @state {string} view - The current calendar view mode: "month", "week", "workWeek", or "day".
 * @state {Event[]} events - List of events to display on the calendar.
 * @state {boolean} showEventForm - Flag to control visibility of the event creation form.
 * 
 * @function goToPrevious
 * @description Navigates to the previous month or previous week depending on the current view.
 * 
 * @function goToNext
 * @description Navigates to the next month or next week depending on the current view.
 * 
 * @function goToToday
 * @description Resets the calendar view to today's date.
 * 
 * @function openEventForm
 * @description Opens the form to create a new event.
 * 
 * @function handleEventCreated
 * @description Callback triggered when a new event is created. Adds the event to the list,
 *              updates the current date to the event's date, switches to "day" view,
 *              and closes the event form.
 * @param {Event} createdEvent - The event object created from the form.
 * 
 * @function handleDayClick
 * @description Sets the current date to the clicked day and switches the view to "day".
 * @param {Date} day - The date that was clicked on the calendar.
 * 
 * @renders
 * - Navigation buttons: Previous, Today, Next, Create Event
 * - View selection dropdown: Month, Week, Work Week, Day
 * - CalendarMatrix component showing the calendar grid for currentDate, view, and events
 * - EventForm component to create a new event (shown conditionally)
 * - Cancel button to close the event creation form
 */
function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const openEventForm = () => {
    setShowEventForm(true);
  };

  const handleEventCreated = (createdEvent) => {
    setEvents([...events, createdEvent]);
    setCurrentDate(new Date(createdEvent.startDateTime || createdEvent.date));
    setView("day");
    setShowEventForm(false);
  };

  const handleDayClick = (day) => {
    setCurrentDate(day);
    setView("day");
  };

  return (
    <div
      className="calendar-component"
      style={{ marginTop: "50px", paddingBottom: "50px", minWidth: "60vw" }}
    >
      <div className="calendar-controls-container">
        <div className="calendar-controls">
          <button onClick={goToPrevious}>← Previous</button>
          <button onClick={goToToday}>Today</button>
          <button onClick={goToNext}>Next →</button>
          <button onClick={openEventForm}>Create Event</button>
        </div>
      </div>

      <div
        className="view-dropdown-container"
        style={{ borderRadius: "20px", padding: "10px" }}
      >
        <div className="view-dropdown">
          <button>View: {view.charAt(0).toUpperCase() + view.slice(1)}</button>
          <div className="view-dropdown-content">
            <button onClick={() => setView("month")}>Month</button>
            <button onClick={() => setView("week")}>Week</button>
            <button onClick={() => setView("workWeek")}>Work Week</button>
            <button onClick={() => setView("day")}>Day</button>
          </div>
        </div>
      </div>

      {!showEventForm && (
        <div className="calendar-matrix-container">
          <CalendarMatrix
            currentDate={currentDate}
            view={view}
            events={events}
            onDayClick={handleDayClick}
          />
        </div>
      )}

      {showEventForm && (
        <>
          <div
            className="event-form-overlay"
            onClick={() => setShowEventForm(false)}
          />
          <div className="event-form-container">
            <EventForm
              onEventCreated={handleEventCreated}
              createButtonProps={{
                bg: "green.500",
                color: "white",
                _hover: { bg: "green.600" },
                variant: "solid",
              }}
            />
            <button
              onClick={() => setShowEventForm(false)}
              className="cancel-button"
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                fontSize: "1.1rem",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CalendarComponent;
