import { useEffect, useState } from "react";


const API_KEY = "3101ccd6aab2290ac267a71fa971d1f3"

const WeatherWidget = () => {
    const [city, setCity] = useState("Loading...");
    const [temperature, setTemperature] = useState(null);
    const [condition, setCondition] = useState("");
    const [iconUrl, setIconUrl] = useState("");


    useEffect(() => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                // Fetch weather data
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                );
                const data = await response.json();
                setTemperature(Math.round(data.main.temp));
                setCondition(data.weather[0].main);
                setIconUrl(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);


                // Fetch city name using Nominatim reverse geocoding
                const geoResponse = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );
                const geoData = await geoResponse.json();
                setCity(
                    geoData.address.city ||
                    geoData.address.town ||
                    geoData.address.village ||
                    geoData.address.state ||
                    "Unknown"
                );
            });
        } else {
            setCity("Location not available!");
        }
    }, []);

    return (
        <div style={{ border: "2px solid #ccc", borderRadius: 18, width: 180, height: 200 }}>
            <h2>The weather:</h2>
            <p>
                <span style={{ fontSize: 26 }}>🏡:</span> <strong style={{ fontSize: 20 }}>{city}</strong>
                <br></br>
                <span style={{ fontSize: 26 }}>🌡️:</span> <strong style={{ fontSize: 20 }}>{temperature !== null ? `${temperature} ℃` : "Loading..."}</strong>
            <br></br>
            <span style={{ fontSize: 28 }}>🌦️: 
                {iconUrl && (
                    <img 
                    src={iconUrl} 
                    alt={condition} 
                    title={condition}
                    style={{ width: 50, height: 50, verticalAlign: "middle" }}
                    />
                )}
            </span>
                </p>
        </div>
    );
};

export default WeatherWidget;
