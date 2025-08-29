"use strict";
const API_KEY = "1e62d31a821f07466bc27f0a3fbe41c6";
const BASE_URL_CURRENT_WEATHER =
  "https://api.openweathermap.org/data/2.5/weather";
const BASE_URL_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";
const OWM_ICON_URL = "http://openweathermap.org/img/wn/";
const cityInput = document.getElementById("city-input");
const locationElement = document.getElementById("location");
const dateElement = document.getElementById("date");
const weatherIconElement = document.getElementById("weather-icon");
const tempValueElement = document.getElementById("temp-value");
const descriptionElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const forecastCardsContainer = document.querySelector(".forecast-cards");
// --- Helpers ---
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}
function formatDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const options = { weekday: "short" };
  return date.toLocaleDateString("en-US", options);
}
// --- Fetching data ---
async function getWeatherData(city) {
  try {
    const currentWeatherResponse = await fetch(
      `${BASE_URL_CURRENT_WEATHER}?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!currentWeatherResponse.ok) {
      if (currentWeatherResponse.status === 404)
        throw new Error("City not found.");
      if (currentWeatherResponse.status === 401)
        throw new Error("Invalid API key.");
      throw new Error(`HTTP error! Status: ${currentWeatherResponse.status}`);
    }
    const currentWeatherData = await currentWeatherResponse.json();
    const forecastResponse = await fetch(
      `${BASE_URL_FORECAST}?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!forecastResponse.ok) {
      if (forecastResponse.status === 404)
        throw new Error("Forecast not found.");
      if (forecastResponse.status === 401) throw new Error("Invalid API key.");
      throw new Error(`HTTP error! Status: ${forecastResponse.status}`);
    }
    const forecastData = await forecastResponse.json();
    return { current: currentWeatherData, forecast: forecastData };
  } catch (error) {
    alert(error.message || "Unable to fetch weather data.");
    console.error(error);
    return null;
  }
}
// --- Update UI ---
function updateUI(data) {
  const { current, forecast } = data;
  if (!current || !forecast) return;
  locationElement.textContent = current.name;
  dateElement.textContent = formatDate(current.dt);
  weatherIconElement.src = `${OWM_ICON_URL}${current.weather[0]?.icon}@2x.png`;
  weatherIconElement.alt = current.weather[0]?.description ?? "Weather icon";
  tempValueElement.textContent = `${Math.round(current.main.temp)}`;
  descriptionElement.textContent = current.weather[0]?.description ?? "";
  humidityElement.textContent = `${current.main.humidity}%`;
  windSpeedElement.textContent = `${Math.round(current.wind.speed * 3.6)} km/h`;
  forecastCardsContainer.innerHTML = "";
  const dailyForecasts = [];
  const seenDates = new Set();
  for (const item of forecast.list) {
    if (item.dt == null) continue; // skip undefined dt
    const dateStr = new Date(item.dt * 1000).toISOString().split("T")[0];
    if (!seenDates.has(dateStr) && dailyForecasts.length < 5) {
      if (
        dailyForecasts.length === 0 ||
        new Date(item.dt * 1000).getHours() === 12
      ) {
        dailyForecasts.push(item);
        seenDates.add(dateStr);
      }
    }
    if (dailyForecasts.length === 5) break;
  }
  // fallback if not enough 12:00 forecasts
  if (dailyForecasts.length < 5) {
    dailyForecasts.length = 0;
    seenDates.clear();
    for (const item of forecast.list) {
      if (item.dt == null) continue;
      const dateStr = new Date(item.dt * 1000).toISOString().split("T")[0];
      if (!seenDates.has(dateStr) && dailyForecasts.length < 5) {
        dailyForecasts.push(item);
        seenDates.add(dateStr);
      }
    }
  }
  dailyForecasts.forEach((item) => {
    if (!item.dt || !item.weather[0]) return;
    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
            <p class="forecast-date">${formatDay(item.dt)}</p>
            <img src="${OWM_ICON_URL}${
      item.weather[0].icon
    }.png" alt="Weather icon">
            <p class="forecast-temp-min">Min: ${Math.round(
              item.main.temp_min
            )}°C</p>
            <p class="forecast-temp-max">Max: ${Math.round(
              item.main.temp_max
            )}°C</p>
        `;
    forecastCardsContainer.appendChild(card);
  });
}
// --- Event listeners ---
cityInput.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    const city = cityInput.value.trim();
    if (!city) {
      alert("Please enter a city name!");
      return;
    }
    const data = await getWeatherData(city);
    if (data) updateUI(data);
  }
});
// --- Init ---
(async function init() {
  const initialCity = "Tbilisi";
  const data = await getWeatherData(initialCity);
  if (data) updateUI(data);
})();
//# sourceMappingURL=app.js.map
