import { useState, useEffect } from "react";
import { Editable, Button, Switch } from "@chakra-ui/react";



function PreferencesPage() {
    const [editCity, setEditCity] = useState("");
    const [weatherEnabled, setWeatherEnabled] = useState(false);
    const [globalInvitesDisabled, setGlobalInvitesDisabled] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Load preferences from localStorage on component mount
    useEffect(() => {
        const savedWeatherEnabled = localStorage.getItem('weatherEnabled') === 'true';
        const savedCity = localStorage.getItem('weatherCity') || '';
        const savedGlobalInvites = localStorage.getItem('globalInvitesDisabled') === 'true';

        setWeatherEnabled(savedWeatherEnabled);
        setEditCity(savedCity);
        setGlobalInvitesDisabled(savedGlobalInvites);
    }, []);

    // Fetch city suggestions from OpenWeatherMap Geocoding API
    const fetchCitySuggestions = async (query) => {
        if (query.length < 2) {
            setCitySuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=3&appid=${API_KEY}`
            );
            const data = await response.json();
            setCitySuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching city suggestions:', error);
            setCitySuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleCityChange = (value) => {
        setEditCity(value);
        fetchCitySuggestions(value);  // ← This calls fetchCitySuggestions when user types
    };


    //OPTION 1 : Global Invites Toggle 
    const handleGlobalInvitesToggle = (checked) => {
        setGlobalInvitesDisabled(checked);
        localStorage.setItem('globalInvitesDisabled', checked.toString());
    };


    const handleCitySelect = (city) => {
        const cityName = city.name;

        setEditCity(cityName);
        setShowSuggestions(false);
        setCitySuggestions([]);

        // Save all needed info for WeatherWidget
        localStorage.setItem('weatherCity', cityName);
        localStorage.setItem('weatherLat', city.lat);
        localStorage.setItem('weatherLon', city.lon);

        // Dispatch event to update widget
        window.dispatchEvent(new CustomEvent('preferencesUpdated'));
    };

    const handleWeatherToggle = (checked) => {
        setWeatherEnabled(checked);
        localStorage.setItem('weatherEnabled', checked.toString());

        if (checked && !editCity.trim()) {
            alert('Please enter a city first!');
        }

        // Dispatch custom event to notify WeatherWidget
        window.dispatchEvent(new CustomEvent('preferencesUpdated'));
    };

    const saveCity = () => {
        localStorage.setItem('weatherCity', editCity);
        setShowSuggestions(false);

        // Dispatch custom event to notify WeatherWidget
        window.dispatchEvent(new CustomEvent('preferencesUpdated'));
    };

    return (
        <>
            <div style={{ padding: "2rem", width: "60vw", margin: "0px auto" }}>
                <div className="preferences-container">
                    <div className="option-globalInvites">
                        <h1>Preferences</h1>
                        <p>Global setting to decline all invites for events</p>
                        <Switch.Root
                            checked={globalInvitesDisabled}
                            onCheckedChange={handleGlobalInvitesToggle}
                        >
                            <Switch.HiddenInput />
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label>Decline all event invitations</Switch.Label>
                        </Switch.Root>
                    </div>

                    <div className="option-weatherWidget" style={{ marginTop: "2rem" }}>
                        <h3>Weather Widget Settings</h3>
                        <Switch.Root
                            checked={weatherEnabled}
                            onCheckedChange={handleWeatherToggle}
                        >
                            <Switch.HiddenInput />
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label>Enable Weather Widget</Switch.Label>
                        </Switch.Root>

                        <div style={{ marginTop: "1rem", position: "relative" }}>
                            <Editable.Root
                                value={editCity}
                                onValueChange={(e) => handleCityChange(e.value)}
                                placeholder="Type in your city"
                                autoResize="true"
                                colorPalette="blue"
                                size="md"
                            >
                                <Editable.Preview />
                                <Editable.Input />
                            </Editable.Root>

                            {/* City Suggestions Dropdown */}
                            {showSuggestions && citySuggestions.length > 0 && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    background: "white",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    zIndex: 1000,
                                    maxHeight: "200px",
                                    overflowY: "auto"
                                }}>
                                    {citySuggestions.map((city, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleCitySelect(city)}
                                            style={{
                                                padding: "8px 12px",
                                                cursor: "pointer",
                                                borderBottom: index < citySuggestions.length - 1 ? "1px solid #eee" : "none",
                                                color: "#333"
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                                        >
                                            {city.name}, {city.state ? `${city.state}, ` : ""}{city.country}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Button
                                onClick={saveCity}
                                style={{ marginTop: "0.5rem" }}
                                size="sm"
                                colorScheme="blue"
                            >
                                Save City
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PreferencesPage;