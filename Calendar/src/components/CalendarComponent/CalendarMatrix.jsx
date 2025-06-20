/**
 * @file CalendarMatrix.jsx
 * @description A React component that renders a calendar matrix with events and recurring series instances.
 * It fetches events and event series from the backend and displays them based on the current view (day, week, or month).
 */

import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

/**
 * @function CalendarMatrix
 * @description Renders a calendar matrix with events and recurring series instances.
 * @param {Object} props - The component props.
 * @param {Date} props.currentDate - The current date to display in the calendar.
 * @param {string} props.view - The current view of the calendar (e.g., "day", "week", "month").
 * @param {Function} props.onDayClick - Callback function triggered when a day is clicked.
 * @returns {JSX.Element} The rendered calendar matrix.
 */
function CalendarMatrix({ currentDate, view, onDayClick }) {
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const [seriesEvents, setSeriesEvents] = useState([]);
  const [seriesEventsExpanded, setSeriesEventsExpanded] = useState([]);

  /**
   * @function generateRepeatedEvents
   * @description Generates repeated instances of a recurring event based on its recurrence rule.
   * @param {Object} event - The event object.
   * @param {Object} event.recurrenceRule - The recurrence rule of the event.
   * @param {string} event.repeatType - The type of recurrence (e.g., "daily", "weekly", "monthly").
   * @param {string} event.startDateTime - The start date and time of the event.
   * @returns {Array<Object>} An array of repeated event instances.
   */
  const generateRepeatedEvents = (event) => {
    const repeatDays = event.recurrenceRule?.interval || 1;
    const repeatType = event.repeatType || "daily";

    const baseDate = new Date(event.startDateTime);
    if (isNaN(baseDate.getTime())) {
      console.warn("Invalid startDateTime for event:", event);
      return [];
    }

    const repeatedEvents = [];

    for (let i = 0; i <= repeatDays; i++) {
      const newDate = new Date(baseDate);

      if (repeatType === "daily") {
        newDate.setDate(baseDate.getDate() + i);
      } else if (repeatType === "weekly") {
        newDate.setDate(baseDate.getDate() + i * 7);
      } else if (repeatType === "monthly") {
        newDate.setMonth(baseDate.getMonth() + i);
      }

      repeatedEvents.push({
        ...event,
        startDateTime: newDate.toISOString(),
        isRepeatedInstance: i > 0,
      });
    }

    return repeatedEvents;
  };

  /**
   * @function fetchEvents
   * @description Fetches events from the backend and processes recurring events.
   */
  useEffect(() => {
    const fetchEvents = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const currentUserId = user?._id;
      setUserId(currentUserId);

      try {
        const response = await fetch(`${key}/api/events`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();

        const filteredEvents = data.filter(
          (event) =>
            event.userId === currentUserId ||
            event.participants?.some((p) => p._id === currentUserId)
        );

        let allEvents = [];
        filteredEvents.forEach((event) => {
          if (event.isRecurring) {
            allEvents.push(...generateRepeatedEvents(event));
          } else {
            allEvents.push(event);
          }
        });

        setEvents(allEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  /**
   * @function generateSeriesInstances
   * @description Generates instances of a recurring event series within a given date range.
   * @param {Object} series - The event series object.
   * @param {Date} fromDate - The start date of the range.
   * @param {Date} toDate - The end date of the range.
   * @returns {Array<Object>} An array of event series instances.
   */
  const generateSeriesInstances = (series, fromDate, toDate) => {
    // Implementation details...
  };

  /**
   * @function handleSeriesEvents
   * @description Fetches event series from the backend and generates instances based on the current view.
   */
  useEffect(() => {
    const handleSeriesEvents = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const currentUserId = user?._id;

      try {
        const response = await fetch(`${key}/api/event-series`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch event series");

        const data = await response.json();

        const filteredSeries = data.filter(
          (series) => series.creatorId === currentUserId
        );
        setSeriesEvents(filteredSeries);

        // Generate instances based on the current view...
      } catch (error) {
        console.error("Error fetching event series:", error);
      }
    };

    handleSeriesEvents();
  }, [currentDate, view]);

  /**
   * @function getMonthDays
   * @description Generates an array of all days in the current month.
   * @returns {Array<Date>} An array of dates representing the days in the current month.
   */
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const end = new Date(year, month + 1, 0);
    return Array.from(
      { length: end.getDate() },
      (_, i) => new Date(year, month, i + 1)
    );
  };

  /**
   * @function getEventsForDay
   * @description Retrieves all events for a specific day.
   * @param {Date} date - The date to retrieve events for.
   * @returns {Array<Object>} An array of events for the specified day.
   */
  const getEventsForDay = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  /**
   * @function getSeriesEventsForDay
   * @description Retrieves all series events for a specific day.
   * @param {Date} date - The date to retrieve series events for.
   * @returns {Array<Object>} An array of series events for the specified day.
   */
  const getSeriesEventsForDay = (date) => {
    return seriesEventsExpanded.filter((event) => {
      const eventDate = new Date(event.startDateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  /**
   * @function getWeekDays
   * @description Generates an array of all days in the current week.
   * @returns {Array<Date>} An array of dates representing the days in the current week.
   */
  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    return Array.from(
      { length: 7 },
      (_, i) =>
        new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    );
  };

  /**
   * @function isToday
   * @description Checks if a given date is today.
   * @param {Date} date - The date to check.
   * @returns {boolean} True if the date is today, false otherwise.
   */
  const isToday = (date) => {
    const now = new Date();
    return date.toDateString() === now.toDateString();
  };
/**
 * @description Renders a loading message if the user ID is not available.
 * @returns {JSX.Element} A loading message.
 */
if (!userId) {
  return <div>Loading user data...</div>;
}

/**
 * @function getMonthName
 * @description Retrieves the full name of the month for a given date.
 * @param {Date} date - The date object.
 * @returns {string} The full name of the month.
 */
const getMonthName = (date) =>
  date.toLocaleDateString(undefined, { month: "long" });

/**
 * @constant {Array<string>} weekdayShortNames
 * @description An array of short names for the days of the week.
 */
const weekdayShortNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * @constant {Object} dayCellStyle
 * @description The default style for a day cell in the calendar.
 */
const dayCellStyle = {
  borderWidth: "1px",
  borderColor: "gray.200",
  borderRadius: "md",
  p: 3,
  cursor: "pointer",
  minH: "160px",
  userSelect: "none",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  overflow: "hidden",
  backgroundColor: "",
  boxShadow: "sm",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
  _hover: {
    bg: "blue.50",
    transform: "scale(1.03)",
    boxShadow: "md",
  },
};

/**
 * @constant {Object} todayStyle
 * @description The style for the current day in the calendar.
 */
const todayStyle = {
  ...dayCellStyle,
  bg: "green.100",
  borderColor: "green.400",
  boxShadow: "0 0 8px 2px rgba(72, 187, 120, 0.6)",
  fontWeight: "700",
  color: "green.800",
  transform: "scale(1.03)",
  _hover: {
    transform: "scale(1.07)",
    boxShadow: "0 0 15px 4px rgba(56, 161, 105, 0.8)",
  },
};

/**
 * @function renderEventTitles
 * @description Renders a maximum of three event titles for a given list of events.
 * @param {Array<Object>} eventList - The list of events to render.
 * @returns {Array<JSX.Element>} An array of JSX elements representing the event titles.
 */
const renderEventTitles = (eventList) =>
  eventList.slice(0, 3).map((e, i) => (
    <Box
      key={i}
      bg="blue.100"
      color="blue.800"
      px={2}
      py={1}
      borderRadius="md"
      fontSize="xs"
      mt={1}
      isTruncated
    >
      {e.title}
    </Box>
  ));

  if (view === "month") {
    const days = getMonthDays();
    const firstDayIndex = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const blanks = Array.from({ length: firstDayIndex });

    return (
      <Box>
        <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="right">
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </Text>

        <SimpleGrid columns={7} spacing={3}>
          {weekdayShortNames.map((day) => (
            <Box
              key={day}
              textAlign="center"
              fontWeight="semibold"
              color="gray.600"
            >
              {day}
            </Box>
          ))}
          {blanks.map((_, i) => (
            <Box key={`blank-${i}`} />
          ))}
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day, userId);
            const seriesDayEvents = getSeriesEventsForDay(day);
            return (
              <Box
                key={i}
                {...(isToday(day) ? todayStyle : dayCellStyle)}
                onClick={() => onDayClick(day)}
              >
                <Text fontWeight="bold" mb={2}>
                  {day.getDate()}
                </Text>
                {renderEventTitles(dayEvents)}
                {renderEventTitles(seriesDayEvents)}
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    );
  }
  if (view === "week") {
    const days = getWeekDays();
    const hourHeight = 25;
    const timelineHeight = 24 * hourHeight;

    const formatTime = (dateStr) => {
      const d = new Date(dateStr);
      return `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;
    };

    return (
      <Box>
        <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="right">
          Week of{" "}
          {days[0].toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>

        <SimpleGrid columns={7} spacing={3} minChildWidth="120px">
          {days.map((day, dayIndex) => {
            const dayEvents = [
              ...getEventsForDay(day),
              ...getSeriesEventsForDay(day),
            ];

            return (
              <Box
                key={`week-day-${day.toISOString()}`}
                borderWidth="1px"
                borderColor="blue.300"
                borderRadius="md"
                boxShadow="md"
                height={`${timelineHeight + 30}px`}
                position="relative"
                {...(isToday(day) ? todayStyle : dayCellStyle)}
                onClick={() => onDayClick(day)}
                overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                <Box
                  textAlign="center"
                  fontWeight="semibold"
                  color="gray.500"
                  borderBottom="2px solid"
                  borderColor="blue.300"
                  py={1}
                  position="sticky"
                  top={0}
                  bg="white"
                  zIndex={10}
                  flexShrink={0}
                >
                  {day.toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                  })}
                </Box>

                <Box position="relative" flex="1" overflow="auto">
                  {Array.from({ length: 24 }, (_, hour) => (
                    <Box
                      key={`week-hour-${dayIndex}-${hour}`}
                      position="absolute"
                      top={`${hour * hourHeight}px`}
                      width="100%"
                      height={`${hourHeight}px`}
                      borderTop="1px solid #CBD5E0"
                      px={1}
                      fontSize="xs"
                      color="gray.500"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Text ml={1} minW="28px">
                        {String(hour).padStart(2, "0")}:00
                      </Text>
                    </Box>
                  ))}

                  {dayEvents.map((e, i) => {
                    const start = new Date(e.startDateTime);
                    const end = new Date(e.endDateTime);

                    const startMinutes =
                      start.getHours() * 60 + start.getMinutes();
                    const endMinutes = end.getHours() * 60 + end.getMinutes();

                    const top = (startMinutes / 60) * hourHeight;
                    const height = ((endMinutes - startMinutes) / 60) * hourHeight;

                    return (
                      <Box
                        key={`week-event-${e.id ?? `${dayIndex}-${i}`}`}
                        position="absolute"
                        top={`${top}px`}
                        left="0px"
                        right="0px"
                        height={`${height}px`}
                        bg="#5565dd"
                        color="white"
                        px={1}
                        py={0.5}
                        borderRadius="md"
                        fontSize="xs"
                        overflow="hidden"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                      >
                        • {e.title}
                        <Text fontSize="xs" mt={1} fontStyle="italic">
                          {`${formatTime(e.startDateTime)} - ${formatTime(
                            e.endDateTime
                          )}`}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    );
  }

  if (view === "workWeek") {
    const days = getWeekDays().slice(1, 6);
    const hourHeight = 25;
    const timelineHeight = 24 * hourHeight;
    const formatTime = (dateStr) => {
      const d = new Date(dateStr);
      return `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;
    };

    return (
      <Box>
        <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="right">
          Work Week of{" "}
          {days[0].toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </Text>

        <SimpleGrid columns={5} spacing={3} minChildWidth="120px">
          {days.map((day) => {
            const dayEvents = [...getEventsForDay(day), ...getSeriesEventsForDay(day)];


            return (
              <Box
                key={`workweek-${day.toDateString()}`}
                borderWidth="1px"
                borderColor="blue.300"
                borderRadius="md"
                boxShadow="md"
                height={`${timelineHeight + 30}px`}
                position="relative"
                {...(isToday(day) ? todayStyle : dayCellStyle)}
                onClick={() => onDayClick(day)}
                overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                <Box
                  textAlign="center"
                  fontWeight="semibold"
                  color="gray.600"
                  borderBottom="2px solid"
                  borderColor="blue.300"
                  py={1}
                  position="sticky"
                  top={0}
                  bg="white"
                  zIndex={10}
                  flexShrink={0}
                >
                  {day.toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                  })}
                </Box>

                <Box position="relative" flex="1" overflow="auto">
                  {Array.from({ length: 24 }, (_, hour) => (
                    <Box
                      key={`workweek-hour-${hour}`}
                      position="absolute"
                      top={`${hour * hourHeight}px`}
                      width="100%"
                      height={`${hourHeight}px`}
                      borderTop="1px solid #CBD5E0"
                      px={1}
                      fontSize="xs"
                      color="gray.500"
                      display="flex"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Text ml={1} minW="28px">
                        {String(hour).padStart(2, "0")}:00
                      </Text>
                    </Box>
                  ))}

                  {dayEvents.map((e) => {
                    const start = new Date(e.startDateTime);
                    const end = new Date(e.endDateTime);

                    const startMinutes =
                      start.getHours() * 60 + start.getMinutes();
                    const endMinutes = end.getHours() * 60 + end.getMinutes();

                    const top = (startMinutes / 60) * hourHeight;
                    const height =
                      ((endMinutes - startMinutes) / 60) * hourHeight;

                    return (
                      <Box
                        key={`workweek-event-${e.id}-${start.getTime()}`}

                        position="absolute"
                        top={`${top}px`}
                        left="0px"
                        right="0px"
                        height={`${height}px`}
                        bg="#5565dd"
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        overflow="hidden"
                        whiteSpace="normal"
                        textOverflow="clip"
                      >
                        <Box fontWeight="bold" isTruncated>
                          • {e.title}
                        </Box>
                        <Text fontSize="xs" mt={1} fontStyle="italic">
                          {`${formatTime(e.startDateTime)} - ${formatTime(
                            e.endDateTime
                          )}`}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    );
  }

  if (view === "day") {
    const day = new Date(currentDate);
    const dayEvents = [...getEventsForDay(day), ...getSeriesEventsForDay(day)];


    const formatTime = (dateStr) => {
      const d = new Date(dateStr);
      return `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;
    };

    const hourHeight = 60;
    const timelineHeight = 24 * hourHeight;

    return (
      <Box>
        <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="right">
          {day.toLocaleDateString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>

        <Box
          borderWidth="1px"
          borderColor="blue.300"
          borderRadius="lg"
          boxShadow="xl"
          position="relative"
          height={`${timelineHeight}px`}
          overflow="hidden"
        >
          {Array.from({ length: 24 }, (_, hour) => (
            <Box
              key={hour}
              position="absolute"
              top={`${hour * hourHeight}px`}
              width="100%"
              height={`${hourHeight}px`}
              borderTop="1px solid #CBD5E0"
              px={4}
              display="flex"
              alignItems="flex-start"
              zIndex={0}
            >
              <Text fontWeight="bold" minW="60px">
                {String(hour).padStart(2, "0")}:00
              </Text>
            </Box>
          ))}

          {dayEvents.map((e) => {
            const start = new Date(e.startDateTime);
            const end = new Date(e.endDateTime);

            const displayStart = new Date(start);
            displayStart.setMinutes(0, 0, 0);

            const displayEnd = new Date(end);
            displayEnd.setHours(end.getHours() + 1, 0, 0, 0);

            const displayStartMinutes =
              displayStart.getHours() * 60 + displayStart.getMinutes();
            const displayEndMinutes =
              displayEnd.getHours() * 60 + displayEnd.getMinutes();

            const top = (displayStartMinutes / 60) * hourHeight;
            const height =
              ((displayEndMinutes - displayStartMinutes) / 60) * hourHeight;

            return (
              <Box
                key={`day-event-${e.id}-${start.getTime()}`}
                position="absolute"
                left="80px"
                right="0"
                top={`${top}px`}
                height={`${height}px`}
                bg="#5565dd"
                color="white"
                px={4}
                py={2}
                borderRadius="md"
                boxShadow="md"
                zIndex={5}
              >
                <Text fontWeight="bold">• {e.title}</Text>
                {e.description && (
                  <Text fontSize="xs" mt={1}>
                    {e.description}
                  </Text>
                )}
                <Text fontSize="xs" mt={1} fontStyle="italic">
                  {`${formatTime(e.startDateTime)} - ${formatTime(
                    e.endDateTime
                  )}`}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }

  return null;
}

export default CalendarMatrix;
