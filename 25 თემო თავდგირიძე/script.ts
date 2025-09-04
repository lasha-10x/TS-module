const API_KEY: string = "b2aa8f553e8e33b91429ba5c0931d905";
const defaultCity: string = "Batumi";

// DOM elements
const cityInput = document.getElementById("city-input") as HTMLInputElement;
const searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
const currentTemp = document.getElementById("current-temp") as HTMLElement;
const currentDesc = document.getElementById("current-desc") as HTMLElement;
const currentLocation = document.getElementById(
  "current-location"
) as HTMLElement;
const weatherIcon = document.getElementById("weather-icon") as HTMLImageElement;
const windSpeed = document.getElementById("wind-speed") as HTMLElement;
const humidity = document.getElementById("humidity") as HTMLElement;
const pressure = document.getElementById("pressure") as HTMLElement;
const forecastContainer = document.getElementById(
  "forecast-container"
) as HTMLElement;

// Types for API responses
interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
  sys: { country: string };
  name: string;
}

interface ForecastItem {
  dt_txt: string;
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

interface ForecastData {
  list: ForecastItem[];
}

// Get current weather
async function getCurrentWeather(city: string): Promise<void> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data: WeatherData = await response.json();

    // Update current weather display
    currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
    currentDesc.textContent = data.weather[0].description;
    currentLocation.textContent = `${data.name}, ${data.sys.country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    // Update weather details
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    humidity.textContent = `${data.main.humidity}%`;
    pressure.textContent = `${data.main.pressure} hPa`;
  } catch (error) {
    console.error("Error fetching current weather:", error);
    currentTemp.textContent = "Error";
    currentDesc.textContent =
      error instanceof Error ? error.message : "Unknown error";
    currentLocation.textContent = "Try another city";
  }
}

// Get weather forecast
async function getWeatherForecast(city: string): Promise<void> {
  forecastContainer.innerHTML =
    '<div class="loading">Loading forecast...</div>';

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data: ForecastData = await response.json();

    // Filter to get one forecast per day (around noon)
    const dailyForecasts = data.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, 5);

    forecastContainer.innerHTML = "";

    dailyForecasts.forEach((day) => {
      const date = new Date(day.dt_txt);
      const temp = Math.round(day.main.temp);
      const desc = day.weather[0].description;
      const icon = day.weather[0].icon;

      const card = document.createElement("div");
      card.className = "forecast-card";

      // Format date
      const options: Intl.DateTimeFormatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
      };
      const formattedDate = date.toLocaleDateString("en-US", options);

      card.innerHTML = `
        <h3>${formattedDate}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
        <p class="temp">${temp}°C</p>
        <p class="desc">${desc}</p>
      `;

      forecastContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching forecast:", error);
    forecastContainer.innerHTML = `<div class="error">${
      error instanceof Error ? error.message : "Unknown error"
    }</div>`;
  }
}

// Load weather data
async function loadWeatherData(city: string): Promise<void> {
  await Promise.all([getCurrentWeather(city), getWeatherForecast(city)]);
}

// Search functionality
function handleSearch(): void {
  const city = cityInput.value.trim();
  if (city) {
    loadWeatherData(city);
    cityInput.value = "";
  }
}

// Event listeners
searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

// Date and time updater
function updateDateTime(): void {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const datetimeEl = document.getElementById("datetime") as HTMLElement;
  if (datetimeEl) {
    datetimeEl.textContent = now.toLocaleDateString("en-US", options);
  }
}

// Sidenav functionality
document.querySelectorAll(".sidenav .item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".sidenav .item")
      .forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  updateDateTime();
  setInterval(updateDateTime, 60000); // Update every minute

  // Load default city weather
  loadWeatherData(defaultCity);
});
