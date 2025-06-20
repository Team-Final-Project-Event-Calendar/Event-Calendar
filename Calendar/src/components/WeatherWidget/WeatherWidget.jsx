/**
 * @file WeatherWidget.jsx
 * @description A React component that displays the current weather information based on the user's geolocation. It fetches weather data and city name using external APIs.
 */

import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import "./WeatherWidget.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

/**
 * @function spinnerCustom
 * @description A custom spinner component for loading states.
 * @returns {JSX.Element} The rendered Spinner component.
 */
const spinnerCustom = () => (
  <Spinner
    color="red.500"
    animationDuration="1.2s"
    borderWidth="2.5px"
    size="xs"
    marginBottom="1.5px"
    marginLeft="6px"
  />
);

/**
 * @function WeatherWidget
 * @description A React component that fetches and displays the current weather and location information based on the user's geolocation.
 * @returns {JSX.Element} The rendered WeatherWidget component.
 */
const WeatherWidget = () => {
  /**
   * @constant {string} city
   * @description The name of the city based on the user's geolocation.
   * @default "Weather..."
   */
  const [city, setCity] = useState("Weather...");

  /**
   * @constant {number|null} temperature
   * @description The current temperature in Celsius.
   * @default null
   */
  const [temperature, setTemperature] = useState(null);

  /**
   * @constant {string} condition
   * @description The current weather condition (e.g., "Clear", "Rain").
   * @default ""
   */
  const [condition, setCondition] = useState("");

  /**
   * @constant {string} iconUrl
   * @description The URL of the weather condition icon.
   * @default ""
   */
  const [iconUrl, setIconUrl] = useState("");

  /**
   * @function useEffect
   * @description Fetches weather and location data when the component mounts. Uses the browser's geolocation API to get the user's coordinates.
   * @async
   */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
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
        } catch (error) {
          console.error("Error fetching weather or location data:", error);
          setCity("Error fetching data");
        }
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
          flexWrap: "wrap",
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
