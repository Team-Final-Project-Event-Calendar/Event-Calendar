import { useEffect, useState } from "react";


const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const WeatherWidget = () => {

  const [city, setCity] = useState("Loading...");
  const [region, setRegion] = useState("")
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
        setIconUrl(
          `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        );

        // Fetch city name using Nominatim reverse geocoding
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const geoData = await geoResponse.json();
        console.log(geoData.address);
        setCity(
          geoData.address.village ||
          geoData.address.town ||
          geoData.address.city ||
          geoData.address.hamlet ||
          "Unknown"
        );

        setRegion(
          geoData.address.state ||
          geoData.address.region ||
          geoData.address.county ||
          ""
        );
      });
    } else {
      setCity("Location not available!");
    }
  }, []);

  return (
    <div
      style={{
        border: "2px solid #90caf9",
        borderRadius: 18,
        width: 240,
        padding: 18,
        background: "#e3f2fd",
        color: "#1565c0",
        fontFamily: "system-ui, sans-serif",
        boxShadow: "0 2px 12px #90caf9",
        margin: "1rem auto",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 20, marginBottom: 4 }}>
        {city}
      </div>
      <div style={{ fontSize: 15, color: "#1976d2", marginBottom: 12 }}>
        {region}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        {iconUrl && (
          <img
            src={iconUrl}
            alt={condition}
            title={condition}
            style={{ width: 48, height: 48, marginRight: 10 }}
          />
        )}
        <span style={{ fontSize: 32, fontWeight: "bold" }}>
          {temperature !== null ? `${temperature}°C` : "Loading..."}
        </span>
      </div>
      <div style={{ fontSize: 18, textTransform: "capitalize" }}>
        {condition}
      </div>
    </div>
  );
};

export default WeatherWidget;
