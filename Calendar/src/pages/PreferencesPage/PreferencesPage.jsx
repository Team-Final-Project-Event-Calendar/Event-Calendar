import { useState, useEffect } from "react";
import { Box, Container, Heading, Text, Switch, Flex } from "@chakra-ui/react";



function PreferencesPage() {
    // const [editCity, setEditCity] = useState("");
    // const [weatherEnabled, setWeatherEnabled] = useState(false);
    const [globalInvitesDisabled, setGlobalInvitesDisabled] = useState(false);
    // const [citySuggestions, setCitySuggestions] = useState([]);
    // const [showSuggestions, setShowSuggestions] = useState(false);

    // Load preferences from localStorage on component mount
    useEffect(() => {
        // const savedWeatherEnabled = localStorage.getItem('weatherEnabled') === 'true';
        // const savedCity = localStorage.getItem('weatherCity') || '';
        const savedGlobalInvites = localStorage.getItem('globalInvitesDisabled') === 'true';

        // setWeatherEnabled(savedWeatherEnabled);
        // setEditCity(savedCity);
        setGlobalInvitesDisabled(savedGlobalInvites);
    }, []);

    //OPTION 1 : Global Invites Toggle 
    const handleGlobalInvitesToggle = (checked) => {
        setGlobalInvitesDisabled(checked);
        localStorage.setItem('globalInvitesDisabled', checked.toString());
    };

    return (
        <Container
            maxW="800px"
            py={8}
            px={6}
            margin="30px auto"
        >
            <Box
                className="preferences-primary-container"
                bg="white"
                borderRadius="lg"
                boxShadow="0 4px 12px rgba(0,0,0,0.08)"
                overflow="hidden"
                border="1px solid"
                borderColor="#5565DD"
            >
                <Box
                    bg="#5565DD"
                    color="white"
                    p={4}
                >
                    <Heading size="lg">Preferences</Heading>
                </Box>

                <Box p={6}>
                    <Box
                        className="preferences-option-globalInvites"
                        bg="blue.50"
                        p={5}
                        borderRadius="md"
                        mb={4}
                        border="1px solid"
                        borderColor="#5565DD"
                    >
                        <Heading className="preferences-option-globalInvites-text"size="md" mb={2} color="blue.700">Event Invitations</Heading>
                        <Text className="preferences-option-globalInvites-text" mb={4} color="gray.600">
                            Control globally whether you want to receive invitations to events from other users.
                        </Text>

                        <Flex
                            className="preferences-option-globalInvites-toggle"
                            alignItems="center"
                            bg="white"
                            p={3}
                            borderRadius="md"
                            border="1px solid"
                            borderColor="#5565DD"
                        >
                            <Switch.Root
                                checked={globalInvitesDisabled}
                                onCheckedChange={handleGlobalInvitesToggle}
                                colorScheme="blue"
                                size="lg"
                            >
                                <Switch.HiddenInput />
                                <Switch.Control mr={3}>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <Switch.Label fontWeight="medium">
                                    Decline all events invitations
                                </Switch.Label>
                            </Switch.Root>
                            <Text className="preferences-option-globalInvites-text" fontSize="sm" color="gray.500" ml="auto">
                                {globalInvitesDisabled ? "On" : "Off"}
                            </Text>
                        </Flex>
                    </Box>

                    {/* More preference options for the future */}
                    <Box className="preferences-option-globalInvites-toggle"
                        p={3}
                        borderRadius="md"
                        bg="gray.50"
                        border="1px dashed"
                        borderColor="gray.300"
                    >
                        <Text className="preferences-option-globalInvites-text" color="gray.500" fontStyle="italic" textAlign="center">
                            More preference options will be available soon.
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

export default PreferencesPage;