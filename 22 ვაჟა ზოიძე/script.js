"use strict";
// main.ts
const API_KEY = "b2aa8f553e8e33b91429ba5c0931d905";
// DOM elements
const forecastContainer = document.getElementById("forecast-container");
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const titleElement = document.getElementById("title");
const defaultCity = "Batumi";
const daysOfForecast = 5;
/**
 * Updates the title with the selected city name
 */
function updateTitle(cityName) {
  if (titleElement) {
    titleElement.textContent = `Weather Forecast - ${cityName}`;
  }
}
/**
 * Fetches and renders the weather forecast for a city
 */
async function getWeatherForecast(city) {
  if (!forecastContainer) return;
  forecastContainer.innerHTML = "Loading...";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    const cityName = data.city.name;
    // Update title with city name
    updateTitle(cityName);
    const forecastList = data.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, daysOfForecast); // Next 5 days at noon
    forecastContainer.innerHTML = "";
    forecastList.forEach((day) => {
      const date = new Date(day.dt_txt);
      const temp = Math.round(day.main.temp);
      const desc = day.weather[0].description;
      const icon = day.weather[0].icon;
      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <h3>${date.toDateString().slice(0, 10)}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
        <p>${temp}°C</p>
        <p>${desc}</p>
      `;
      forecastContainer.appendChild(card);
    });
  } catch (err) {
    if (forecastContainer) {
      const message = err instanceof Error ? err.message : "An error occurred";
      forecastContainer.innerHTML = `<p style="color:red;">${message}</p>`;
    }
    if (titleElement) {
      titleElement.textContent = "Weather Forecast";
    }
  }
}
/**
 * Handle search form submission
 */
if (form && cityInput) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
      getWeatherForecast(city);
    }
  });
}
// Load Batumi forecast by default
getWeatherForecast(defaultCity);
//# sourceMappingURL=script.js.map
