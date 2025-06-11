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
} from '@chakra-ui/react';
import { MdPerson } from 'react-icons/md';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../components/Authentication/AuthContext';

function EventDetails() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const key = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${key}/api/events/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }

                const data = await response.json();
                setEvent({
                    title: data.title,
                    description: data.description,
                    userId: data.userId,
                    start: data.startDateTime || data.startDate,
                    end: data.endDateTime || data.endDate,
                    coverPhoto: data.coverPhoto,
                    location: data.location,
                    participants: data.participants,
                });

            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [id, key]);

    if (loading) {
        return (
            <Box textAlign="center" py={10}>
                <Spinner size="xl" />
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
    const handleRemoveParticipant = async (participantId) => {
        try {
            const response = await fetch(`${key}/api/events/${id}/participants/${participantId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to remove participant');
            }
    
        
            setEvent((prev) => ({
                ...prev,
                participants: prev.participants.filter((p) => p._id !== participantId),
            }));
        } catch (error) {
            console.error('Error removing participant:', error);
        }
    };
    

    return (
        <Container maxW="5xl" py={15}>
            <Box
                bg="gray.50"
                _dark={{ bg: 'gray.600' }}
                boxShadow="xl"
                borderRadius="2xl"
                color={'blue.500'}
                p={8}
            >
                <VStack spacing={10} align="start">
                    <Badge colorScheme="teal" color={'blue.500'} background={'black'}>
                        {event.userId === user._id ? `Created by ${user.username}` : 'Shared event'}
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
                                {event.location.address ? event.location.address + ', ' : ''}
                                {event.location.city ? event.location.city + ', ' : ''}
                                {event.location.country || ''}
                            </Text>
                        </Stack>
                    )}
    
                    <Stack spacing={1} w="100%">
                        <Text fontWeight="bold">Description:</Text>
                        <Text>{event.description}</Text>
                    </Stack>
    
                    <Stack spacing={1} w="100%">
                        <Text fontWeight="bold">Participants:</Text>
                        {event.participants && event.participants.length > 0 ? (
                            <Box as="ul" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                {event.participants.map((participant) => (
                                    <Box
                                        as="li"
                                        key={participant._id || participant}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        mb={1}
                                        pr={2}
                                    >
                                        <Box display="flex" alignItems="center">
                                            <MdPerson style={{ marginRight: 6 }} />
                                            <Text as="span">{participant.username || participant}</Text>
                                        </Box>
    
                                        {event.userId === user._id && (
                                            <Text
                                            as="button"
                                            fontSize="sm"
                                            color="white"
                                            background="red.600"
                                            px={3}         
                                            py={1}         
                                            borderRadius="md"
                                            _hover={{ background: 'red.700' }}
                                                onClick={() => handleRemoveParticipant(participant._id)}
                                            >
                                                Remove
                                            </Text>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Text>No participants yet.</Text>
                        )}
                    </Stack>
                </VStack>
            </Box>
        </Container>
    );
    
}

export default EventDetails;
