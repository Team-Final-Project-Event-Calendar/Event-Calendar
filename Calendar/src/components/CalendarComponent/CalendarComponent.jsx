import React, { useState } from "react";
import CalendarMatrix from "./CalendarMatrix";
import "./Calendar.css";
import EventForm from "../EventForm/EventForm";

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
    <div className="calendar-component">
      <div className="calendar-controls-container">
        <div className="calendar-controls">
          <button onClick={goToPrevious}>← Previous</button>
          <button onClick={goToToday}>Today</button>
          <button onClick={goToNext}>Next →</button>
          <button onClick={openEventForm}>Create Event</button>
        </div>
      </div>

      <div className="view-dropdown-container">
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
