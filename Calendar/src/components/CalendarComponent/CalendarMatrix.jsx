import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';

const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

function CalendarMatrix({ currentDate, view, onDayClick }) {
    const [events, setEvents] = useState([]);

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
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }
                const data = await response.json();
                setEvents(data);
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
        return Array.from({ length: end.getDate() }, (_, i) => new Date(year, month, i + 1));
    };

    const getWeekDays = () => {
        const start = new Date(currentDate);
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - start.getDay());
        return Array.from({ length: 7 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i));
    };

    const getEventsForDay = (date) =>
        events.filter(e => {
            const eventDate = e.date || e.startDateTime;
            return new Date(eventDate).toDateString() === date.toDateString();
        });

    const getMonthName = (date) =>
        date.toLocaleDateString(undefined, { month: 'long' });

    const weekdayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dayCellStyle = {
        borderWidth: '1px',
        borderColor: 'gray.200',
        borderRadius: 'md',
        p: 2,
        cursor: 'pointer',
        minH: '110px',
        _hover: { bg: 'blue.50' },
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflow: 'hidden'
    };

    const renderEventTitles = (eventList) => (
        eventList.slice(0, 2).map((e, i) => (
            <Text key={i} fontSize="xs" isTruncated color="blue.600">
                • {e.title}
            </Text>
        ))
    );

    if (view === 'month') {
        const days = getMonthDays();
        const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const blanks = Array.from({ length: firstDayIndex });

        return (
            <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                    {getMonthName(currentDate)} {currentDate.getFullYear()}
                </Text>

                <SimpleGrid columns={7} spacing={2}>
                    {weekdayShortNames.map(day => (
                        <Box key={day} textAlign="center" fontWeight="semibold" color="gray.600">
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
                                {...dayCellStyle}
                                onClick={() => onDayClick(day)}
                            >
                                <Text fontWeight="bold" mb={1}>{day.getDate()}</Text>
                                {renderEventTitles(dayEvents)}
                            </Box>
                        );
                    })}
                </SimpleGrid>
            </Box>
        );
    }

    if (view === 'week') {
        const days = getWeekDays();

        return (
            <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                    Week of {days[0].toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </Text>

                <SimpleGrid columns={7} spacing={2}>
                    {days.map((day, i) => (
                        <Box
                            key={`header-${i}`}
                            textAlign="center"
                            fontWeight="semibold"
                            color="gray.600"
                            pb={2}
                            borderBottom="2px"
                            borderColor="blue.400"
                            userSelect="none"
                        >
                            {day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </Box>
                    ))}

                    {days.map((day, i) => {
                        const dayEvents = getEventsForDay(day);
                        return (
                            <Box
                                key={i}
                                {...dayCellStyle}
                                onClick={() => onDayClick(day)}
                                minH="130px"
                            >
                                <Text fontWeight="bold" mb={1}>{day.getDate()}</Text>
                                {renderEventTitles(dayEvents)}
                            </Box>
                        );
                    })}
                </SimpleGrid>
            </Box>
        );
    }

    if (view === 'workWeek') {
        const days = getWeekDays().slice(1, 6);

        return (
            <Box bg="gray.50" p={6} borderRadius="lg">
                <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
                    Work Week: {days[0].toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} - {days[days.length - 1].toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                </Text>

                <SimpleGrid columns={5} spacing={4}>
                    {days.map((day, i) => (
                        <Box
                            key={`header-${i}`}
                            textAlign="center"
                            fontWeight="600"
                            color="blue.600"
                            borderBottom="3px solid"
                            borderColor="blue.400"
                            pb={2}
                            userSelect="none"
                        >
                            {day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </Box>
                    ))}

                    {days.map((day, i) => {
                        const dayEvents = getEventsForDay(day);
                        return (
                            <Box
                                key={i}
                                {...dayCellStyle}
                                onClick={() => onDayClick(day)}
                                minH="140px"
                                bg="white"
                                boxShadow="sm"
                                _hover={{ bg: 'blue.100' }}
                            >
                                <Text fontWeight="bold" mb={1} color="gray.700">
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

    if (view === 'day') {
        const dayEvents = getEventsForDay(currentDate);

        return (
            <Box p={4}>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                    {currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>

                {dayEvents.length === 0 ? (
                    <Text>No events for this day.</Text>
                ) : (
                    dayEvents.map((e, idx) => (
                        <Box key={idx} p={3} mb={3} borderWidth="1px" borderRadius="md" boxShadow="sm">
                            <Text fontWeight="bold" fontSize="lg">{e.title}</Text>
                            <Text fontSize="sm" color="gray.600">{e.description}</Text>
                        </Box>
                    ))
                )}
            </Box>
        );
    }

    return <Box p={4}>View "{view}" is not implemented yet</Box>;
}

export default CalendarMatrix;
