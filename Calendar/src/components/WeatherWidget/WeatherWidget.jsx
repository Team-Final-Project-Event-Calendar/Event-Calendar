import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import "./WeatherWidget.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const spinnerCustom = () => (
  <Spinner color="red.500" animationDuration="0.8s" borderWidth="3px" />
);

const WeatherWidget = () => {
  const [city, setCity] = useState(spinnerCustom());
  // const [region, setRegion] = useState("")
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
        setCity(
          geoData.address.village ||
            geoData.address.town ||
            geoData.address.city ||
            geoData.address.hamlet ||
            "Unknown"
        );

        // setRegion(
        //   geoData.address.state ||
        //   geoData.address.region ||
        //   geoData.address.county ||
        //   ""
        // );
      });
    } else {
      setCity("Location not available!");
    }
  }, []);

  return (
    <div
      className="weather-widget"
      style={
        {
          // display: "flex",
          flexWrap: "wrap",
          // alignItems: "center",
          // border: "3px solid #90caf9",
          // borderRadius: 22,
          // background: "#90caf9",
          // color: "#1565c0",
          // fontFamily: "system-ui, sans-serif",
        }
      }
    >
      <span style={{ fontWeight: "bold", fontSize: 16, marginLeft: 5 }}>
        {city}
      </span>
      {iconUrl && (
        <img
          src={iconUrl}
          alt={condition}
          title={condition}
          style={{ width: 38, height: 38 }}
        />
      )}
      <span style={{ fontWeight: "bold", fontSize: 18, marginRight: 5 }}>
        {temperature !== null ? `${temperature}°C` : spinnerCustom()}
      </span>
    </div>
  );
};

export default WeatherWidget;
