const API_KEY = "1e62d31a821f07466bc27f0a3fbe41c6";
const BASE_URL_CURRENT_WEATHER =
  "https://api.openweathermap.org/data/2.5/weather";
const BASE_URL_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";
const OWM_ICON_URL = "http://openweathermap.org/img/wn/";

const cityInput = document.getElementById("city-input") as HTMLInputElement;
const locationElement = document.getElementById("location") as HTMLElement;
const dateElement = document.getElementById("date") as HTMLElement;
const weatherIconElement = document.getElementById(
  "weather-icon"
) as HTMLImageElement;
const tempValueElement = document.getElementById("temp-value") as HTMLElement;
const descriptionElement = document.getElementById(
  "description"
) as HTMLElement;
const humidityElement = document.getElementById("humidity") as HTMLElement;
const windSpeedElement = document.getElementById("wind-speed") as HTMLElement;
const forecastCardsContainer = document.querySelector(
  ".forecast-cards"
) as HTMLElement;

// --- Types ---
interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface CurrentWeather {
  dt: number;
  name: string;
  weather: Weather[];
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
    pressure: number;
    temp_max: number;
    temp_min: number;
  };
  wind: {
    speed: number;
  };
}

interface ForecastItem {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: Weather[];
}

interface ForecastData {
  list: ForecastItem[];
}

interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastData;
}

// --- Helpers ---
function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function formatDay(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = { weekday: "short" };
  return date.toLocaleDateString("en-US", options);
}

// --- Fetching data ---
async function getWeatherData(city: string): Promise<WeatherData | null> {
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
    const currentWeatherData: CurrentWeather =
      await currentWeatherResponse.json();

    const forecastResponse = await fetch(
      `${BASE_URL_FORECAST}?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!forecastResponse.ok) {
      if (forecastResponse.status === 404)
        throw new Error("Forecast not found.");
      if (forecastResponse.status === 401) throw new Error("Invalid API key.");
      throw new Error(`HTTP error! Status: ${forecastResponse.status}`);
    }
    const forecastData: ForecastData = await forecastResponse.json();

    return { current: currentWeatherData, forecast: forecastData };
  } catch (error: any) {
    alert(error.message || "Unable to fetch weather data.");
    console.error(error);
    return null;
  }
}

// --- Update UI ---
function updateUI(data: WeatherData): void {
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

  const dailyForecasts: ForecastItem[] = [];
  const seenDates = new Set<string>();

  for (const item of forecast.list) {
    if (item.dt == null) continue; // skip undefined dt
    const dateStr = new Date(item.dt * 1000).toISOString().split("T")[0];
    if (!seenDates.has(dateStr!) && dailyForecasts.length < 5) {
      if (
        dailyForecasts.length === 0 ||
        new Date(item.dt * 1000).getHours() === 12
      ) {
        dailyForecasts.push(item);
        seenDates.add(dateStr!);
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
      if (!seenDates.has(dateStr!) && dailyForecasts.length < 5) {
        dailyForecasts.push(item);
        seenDates.add(dateStr!);
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
cityInput.addEventListener("keypress", async (event: KeyboardEvent) => {
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
