/**
 * @file EventDetails.jsx
 * @description A React component that displays detailed information about an event. It fetches event data from the backend and provides functionality for participants to leave the event or for the owner to manage participants.
 */

import {
    Box,
    Heading,
    Text,
    VStack,
    Stack,
    Spinner,
    Container,
    Badge,
    Image,
    Button,
} from '@chakra-ui/react';
import { MdPerson } from 'react-icons/md';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../components/Authentication/AuthContext';
import { CustomSpinner } from '../PublicPage/PublicPage';

/**
 * @function EventDetails
 * @description Displays detailed information about an event, including participants, event details, and options for managing participation.
 * @returns {JSX.Element} The rendered EventDetails component.
 */
function EventDetails() {
    /**
     * @constant {string} id
     * @description The event ID extracted from the URL parameters.
     */
    const { id } = useParams();

    /**
     * @constant {Object} user
     * @description The currently logged-in user, retrieved from the AuthContext.
     */
    const { user } = useContext(AuthContext);

    /**
     * @constant {Object|null} event
     * @description The event data fetched from the backend. Initially set to `null`.
     */
    const [event, setEvent] = useState(null);

    /**
     * @constant {boolean} loading
     * @description Indicates whether the event data is being loaded.
     */
    const [loading, setLoading] = useState(true);

    /**
     * @constant {boolean} isLeaving
     * @description Indicates whether the user is in the process of leaving the event.
     */
    const [isLeaving, setIsLeaving] = useState(false);

    /**
     * @constant {boolean} isParticipant
     * @description Indicates whether the logged-in user is a participant in the event.
     */
    const [isParticipant, setIsParticipant] = useState(false);

    /**
     * @constant {string} backendUrl
     * @description The base URL for the backend API.
     */
    const backendUrl = import.meta.env.VITE_BACK_END_URL || 'http://localhost:5000';

    /**
     * @function useEffect
     * @description Fetches event data from the backend when the component mounts or when the `id` or `backendUrl` changes.
     * @async
     */
    useEffect(() => {
        async function fetchEvent() {
            try {
                setLoading(true);

                const token = localStorage.getItem("token");

                if (token) {
                    const response = await fetch(`${backendUrl}/api/events`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (!response.ok) throw new Error('Failed to fetch events');

                    const events = await response.json();
                    const data = events.find(event => event._id === id);

                    if (!data) throw new Error('Event not found');

                    setEvent({
                        ...data,
                        start: data.startDateTime || data.startDate,
                        end: data.endDateTime || data.endDate,
                    });

                } else {
                    const response = await fetch(`${backendUrl}/api/events/public`);

                    if (!response.ok) throw new Error('Failed to fetch public events');

                    const publicEvents = await response.json();
                    const data = publicEvents.find(event => event._id === id);

                    if (!data) throw new Error('Event not found or not public');

                    setEvent({
                        ...data,
                        start: data.startDateTime || data.startDate,
                        end: data.endDateTime || data.endDate,
                    });
                }

            } catch (err) {
                console.error(err);
                setEvent(null);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchEvent();
    }, [id, backendUrl]);

    /**
     * @function useEffect
     * @description Updates the `isParticipant` state based on the event's participants and the logged-in user's ID.
     */
    useEffect(() => {
        if (event?.participants && user?._id) {
            setIsParticipant(event.participants.some((p) => p._id === user._id));
        } else {
            setIsParticipant(false);
        }
    }, [event, user?._id]);

    /**
     * @function handleRemoveParticipant
     * @description Removes a participant from the event.
     * @param {string} participantId - The ID of the participant to remove.
     * @async
     */
    const handleRemoveParticipant = async (participantId) => {
        try {
            const response = await fetch(`${backendUrl}/api/events/${id}/participants/${participantId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Failed to remove participant');

            setEvent((prev) => ({
                ...prev,
                participants: prev.participants.filter((p) => p._id !== participantId),
            }));
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * @function handleLeaveEvent
     * @description Allows the logged-in user to leave the event.
     * @async
     */
    const handleLeaveEvent = async () => {
        try {
            setIsLeaving(true);
            const response = await fetch(`${backendUrl}/api/events/${id}/leave`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) throw new Error('Failed to leave event');

            setEvent((prev) => ({
                ...prev,
                participants: prev.participants.filter((p) => p._id !== user._id),
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setIsLeaving(false);
        }
    };

    if (loading) {
        return (
            <Box textAlign="center">
                <CustomSpinner />
            </Box>
        );
    }

    if (!event) {
        return (
            <Box textAlign="center" py={10}>
                <Text color="red.500">Event not found or failed to load.</Text>
            </Box>
        );
    }

    /**
     * @constant {boolean} isOwner
     * @description Indicates whether the logged-in user is the owner of the event.
     */
    const isOwner = user ? event.userId && event.userId.toString() === user._id : false;

    return (
        <Container maxW="5xl" py={15}>
            <Box
                bg="gray.50"
                _dark={{ bg: 'gray.600' }}
                boxShadow="xl"
                borderRadius="2xl"
                color="blue.500"
                p={8}
            >
                <VStack spacing={10} align="start">
                    <Badge colorScheme="teal" bg="black" color="blue.500">
                        {isOwner ? `Created by ${user.username}` : 'Shared event'}
                    </Badge>

                    <Heading size="lg">{event.title}</Heading>

                    {event.coverPhoto && (
                        <Box w="100%" maxH="400px" overflow="hidden" borderRadius="md" mb={5}>
                            <Image
                                src={event.coverPhoto}
                                alt={`Cover for ${event.title}`}
                                objectFit="cover"
                                w="100%"
                                h="100%"
                            />
                        </Box>
                    )}

                    <Stack spacing={1} w="100%">
                        <Text fontWeight="bold">Start:</Text>
                        <Text>{new Date(event.start).toLocaleString()}</Text>
                    </Stack>

                    <Stack spacing={1} w="100%">
                        <Text fontWeight="bold">End:</Text>
                        <Text>{new Date(event.end).toLocaleString()}</Text>
                    </Stack>

                    {event.location && (
                        <Stack spacing={1} w="100%">
                            <Text fontWeight="bold">Location:</Text>
                            <Text>
                                {[event.location.address, event.location.city, event.location.country]
                                    .filter(Boolean)
                                    .join(', ')}
                            </Text>
                        </Stack>
                    )}

                    <Stack spacing={1} w="100%">
                        <Text fontWeight="bold">Description:</Text>
                        <Text>{event.description}</Text>
                    </Stack>
                    {user ? (
                        <Stack spacing={1} w="100%">
                            <Text fontWeight="bold">Participants:</Text>
                            {event.participants && event.participants.length > 0 ? (
                                <Box as="ul" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                    {event.participants.map((participant) => (
                                        <Box
                                            as="li"
                                            key={participant._id}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            mb={1}
                                            pr={2}
                                        >
                                            <Box display="flex" alignItems="center">
                                                <MdPerson style={{ marginRight: 6 }} />
                                                <Text as="span">{participant.username}</Text>
                                            </Box>

                                            {isOwner && participant._id !== user._id && (
                                                <Button
                                                    size="sm"
                                                    colorScheme="red"
                                                    background={'red.600'}
                                                    onClick={() => handleRemoveParticipant(participant._id)}
                                                >
                                                    Remove
                                                </Button>
                                            )}

                                            {participant._id === user._id && (
                                                <Button
                                                    size="sm"
                                                    colorScheme="orange"
                                                    background={'orange.600'}
                                                    onClick={handleLeaveEvent}
                                                    isLoading={isLeaving}
                                                    loadingText="Leaving..."
                                                >
                                                    Leave
                                                </Button>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Text>No participants yet.</Text>
                            )}
                        </Stack>
                    ) : (
                        <Stack spacing={1} w="100%">
                            <Text fontWeight="bold">Login to see participants and join this event</Text>
                        </Stack>
                    )}
                </VStack>
            </Box>
        </Container>
    );
}

export default EventDetails;
