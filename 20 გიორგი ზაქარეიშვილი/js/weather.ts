const apiKey: string = "709a4b025a4d1560c7d7c2b53138e488";

// DOM elements
const searchInput = document.querySelector("input") as HTMLInputElement | null;
const searchBtn = document.querySelector(
  ".search-btn"
) as HTMLButtonElement | null;
const locationEl = document.querySelector(".location") as HTMLDivElement | null;
const temperatureEl = document.querySelector(
  ".temperature"
) as HTMLDivElement | null;
const dateTimeEl = document.querySelector(
  ".date-time"
) as HTMLDivElement | null;
const forecastCardsContainer = document.querySelector(
  ".forecast-cards"
) as HTMLDivElement | null;
const houseImage = document.querySelector(
  ".illustration-image"
) as HTMLDivElement | null;

interface WeatherData {
  main: { temp: number };
  name: string;
  timezone: number;
  dt: number;
  sys: { sunrise: number; sunset: number };
  weather: { main: string }[];
}

interface ForecastEntry {
  dt_txt: string;
  main: { temp: number };
  weather: { main: string }[];
  pop: number; // probability of precipitation
}

interface ForecastData {
  list: ForecastEntry[];
}

async function fetchWeather(city: string) {
  if (!temperatureEl || !dateTimeEl || !locationEl) return;

  temperatureEl.textContent = "Loading...";
  dateTimeEl.textContent = "Loading time...";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error("City not found");

    const data: WeatherData = await response.json();

    const temp = Math.round(data.main.temp);
    const cityName = data.name;
    const timezoneOffset = data.timezone;
    const localTime = getLocalTime(timezoneOffset);

    locationEl.textContent = cityName;
    temperatureEl.textContent = `${temp}°`;
    dateTimeEl.textContent = localTime;

    const mainCondition = data.weather[0]!.main;
    const currentTime = data.dt;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;

    updateIllustration(mainCondition, currentTime, sunrise, sunset);
    fetchForecast(city);
  } catch (error: any) {
    alert("Error: " + error.message);
    temperatureEl.textContent = "N/A";
    dateTimeEl.textContent = "—";
  }
}

async function fetchForecast(city: string) {
  if (!forecastCardsContainer) return;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error("Forecast not found");

    const data: ForecastData = await response.json();
    const dailyMap: { [key: string]: ForecastEntry } = {};

    data.list.forEach((entry) => {
      if (!entry.dt_txt) return; // ensure dt_txt exists
      const date: string | undefined = entry.dt_txt.split(" ")[0];
      if (!dailyMap[date!]) dailyMap[date!] = entry;
    });

    const entries = Object.values(dailyMap).slice(1, 6); // next 5 days
    forecastCardsContainer.innerHTML = "";

    entries.forEach((day) => {
      const weekday = new Date(day.dt_txt).toLocaleDateString("en-US", {
        weekday: "short",
      });
      const emoji = getWeatherEmoji(day.weather[0]!.main);
      const chance = `${Math.round(day.pop * 100)}%`;
      const temp = `${Math.round(day.main.temp)}°`;

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
                <div class="time">${weekday}</div>
                <div class="icon">${emoji}</div>
                <div class="chance">${chance}</div>
                <div class="temp">${temp}</div>
            `;
      forecastCardsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Forecast error", err);
  }
}

function updateIllustration(
  mainCondition: string,
  currentTimestamp: number,
  sunriseTimestamp: number,
  sunsetTimestamp: number
) {
  const isDay =
    currentTimestamp >= sunriseTimestamp && currentTimestamp < sunsetTimestamp;
  updateBackground(isDay);
  if (houseImage) houseImage.textContent = getWeatherEmoji(mainCondition);
}

function updateBackground(isDay: boolean) {
  document.body.style.background = isDay
    ? "linear-gradient(180deg, #87ceeb 0%, #a6d8ff 100%)"
    : "linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)";
}

function getWeatherEmoji(condition: string): string {
  switch (condition.toLowerCase()) {
    case "clear":
      return "☀️";
    case "clouds":
      return "☁️";
    case "rain":
      return "🌧️";
    case "drizzle":
      return "🌦️";
    case "thunderstorm":
      return "⛈️";
    case "snow":
      return "❄️";
    case "mist":
    case "fog":
      return "🌫️";
    case "haze":
      return "☀️";
    default:
      return "";
  }
}

function getLocalTime(offsetInSeconds: number): string {
  const nowUTC = new Date(
    new Date().getTime() + new Date().getTimezoneOffset() * 60000
  );
  const localTime = new Date(nowUTC.getTime() + offsetInSeconds * 1000);
  return localTime.toLocaleString("en-US", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Event listeners
searchBtn?.addEventListener("click", () => {
  const city = searchInput?.value.trim();
  if (city) fetchWeather(city);
});

searchInput?.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    const city = searchInput?.value.trim();
    if (city) fetchWeather(city);
  }
});

// Default city
fetchWeather("Batumi");
