import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

function CalendarMatrix({ currentDate, view, onDayClick }) {
  const [events, setEvents] = useState([]);

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${key}/api/events`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();

        let allEvents = [];

        data.forEach((event) => {
          if (event.isRecurring) {
            const repeats = generateRepeatedEvents(event);
            allEvents.push(...repeats);
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

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const end = new Date(year, month + 1, 0);
    return Array.from(
      { length: end.getDate() },
      (_, i) => new Date(year, month, i + 1)
    );
  };

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

  const getEventsForDay = (date) =>
    events.filter((e) => {
      const eventDate = new Date(e.startDateTime);
      return eventDate.toDateString() === date.toDateString();
    });

  const isToday = (date) => {
    const now = new Date();
    return date.toDateString() === now.toDateString();
  };

  const getMonthName = (date) =>
    date.toLocaleDateString(undefined, { month: "long" });

  const weekdayShortNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
        • {e.title}
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
            const dayEvents = getEventsForDay(day);
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
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    );
  }

  if (view === "week") {
    const days = getWeekDays();

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

        <SimpleGrid columns={7} spacing={3}>
          {days.map((day, i) => (
            <Box
              key={`header-${i}`}
              textAlign="center"
              fontWeight="semibold"
              color="gray.600"
              borderBottom="2px solid"
              borderColor="blue.300"
              pb={2}
            >
              {day.toLocaleDateString(undefined, {
                weekday: "short",
                day: "numeric",
              })}
            </Box>
          ))}
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day);
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
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    );
  }

  if (view === "workWeek") {
    const days = getWeekDays().slice(1, 6);

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

        <SimpleGrid columns={5} spacing={3}>
          {days.map((day, i) => (
            <Box
              key={`header-${i}`}
              textAlign="center"
              fontWeight="semibold"
              color="gray.600"
              borderBottom="2px solid"
              borderColor="blue.300"
              pb={2}
            >
              {day.toLocaleDateString(undefined, {
                weekday: "short",
                day: "numeric",
              })}
            </Box>
          ))}
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day);
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
              </Box>
            );
          })}
        </SimpleGrid>
      </Box>
    );
  }

  if (view === "day") {
    const day = new Date(currentDate);
    const dayEvents = getEventsForDay(day);

    dayEvents.sort(
      (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
    );

    const hours = Array.from({ length: 24 }, (_, i) => i);

    const renderedEventIds = new Set();

    const formatTime = (dateStr) => {
      const d = new Date(dateStr);
      return `${String(d.getHours()).padStart(2, "0")}:${String(
        d.getMinutes()
      ).padStart(2, "0")}`;
    };

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
          bg="blue.50"
          boxShadow="xl"
        >
          {hours.map((hour) => {
            if (
              Array.from(renderedEventIds).some((id) => {
                const e = dayEvents.find((ev) => ev.id === id);
                if (!e) return false;
                const start = new Date(e.startDateTime);
                const end = new Date(e.endDateTime);
                return hour > start.getHours() && hour < end.getHours();
              })
            ) {
              return null;
            }

            const startingEvents = dayEvents.filter((e) => {
              const start = new Date(e.startDateTime);
              return start.getHours() === hour;
            });

            return (
              <Box
                key={hour}
                borderBottom="1px solid #CBD5E0"
                px={4}
                py={3}
                display="flex"
                alignItems="flex-start"
                position="relative"
              >
                <Text fontWeight="bold" minW="60px">
                  {String(hour).padStart(2, "0")}:00
                </Text>
                <Box flex="1" pl={4}>
                  {startingEvents.length === 0 ? (
                    <Text fontSize="sm" color="gray.500">
                      No events
                    </Text>
                  ) : (
                    startingEvents.map((e) => {
                      renderedEventIds.add(e.id);

                      const start = new Date(e.startDateTime);
                      const end = new Date(e.endDateTime);

                      const durationMinutes = (end - start) / (1000 * 60);

                      const pxPerMinute = 40 / 60;
                      const heightPx = Math.max(
                        durationMinutes * pxPerMinute,
                        40
                      );

                      return (
                        <Box
                          key={e.id}
                          bg="green.300"
                          color="black"
                          px={3}
                          py={2}
                          borderRadius="md"
                          fontSize="sm"
                          mb={2}
                          boxShadow="md"
                          style={{ minHeight: `${heightPx}px` }}
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
                    })
                  )}
                </Box>
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
