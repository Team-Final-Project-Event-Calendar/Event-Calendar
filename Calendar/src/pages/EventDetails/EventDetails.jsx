import {
    Box,
    Heading,
    Text,
    VStack,
    Stack,
    Spinner,
    Container,
    Badge,
} from '@chakra-ui/react';
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

    return (
        <Container maxW="5xl" py={15} >
            <Box
                bg="gray.50"
                _dark={{ bg: 'gray.600' }}
                boxShadow="xl"
                borderRadius="2xl"
                color={'blue.500'}
                p={8}
            >
                <VStack spacing={20} align="start">
                    <Badge colorScheme="teal" color={'blue.500'} background={'black'}>
                        {event.userId === user._id ? `Created by ${user.username}` : 'Shared event'}
                    </Badge>

                    <Heading size="lg">{event.title}</Heading>

                    <Stack spacing={1}>
                        <Text fontWeight="bold">Start:</Text>
                        <Text>{new Date(event.start).toLocaleString()}</Text>
                    </Stack>

                    <Stack spacing={1}>
                        <Text fontWeight="bold">End:</Text>
                        <Text>{new Date(event.end).toLocaleString()}</Text>
                    </Stack>

                    <Stack spacing={1}>
                        <Text fontWeight="bold">Description:</Text>
                        <Text>{event.description}</Text>
                    </Stack>
                </VStack>
            </Box>
        </Container>
    );
}

export default EventDetails;
