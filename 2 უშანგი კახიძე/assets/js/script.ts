// -------------------- Types --------------------
interface Weather {
  main: string;
  description: string;
  icon: string;
}

interface MainData {
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
}

interface WindData {
  speed: number;
}

interface CloudsData {
  all: number;
}

interface SysData {
  country: string;
}

interface CurrentWeatherData {
  name: string;
  main: MainData;
  weather: Weather[];
  wind: WindData;
  clouds: CloudsData;
  sys: SysData;
  timezone: number;
}

interface ForecastItem {
  dt_txt: string;
  main: MainData;
  weather: Weather[];
  pop: number;
  [key: string]: any;
}

interface ForecastData {
  list: ForecastItem[];
}

// -------------------- Constants --------------------
const API_KEY = "b7c3ceee1d6e0350759daab0898f4b00";

const backgrounds: Record<string, string> = {
  "Clear-d": "clear.jpg",
  "Clear-n": "night.jpg",
  "Clouds-d": "clouds.jpg",
  "Clouds-n": "clouds-night.jpg",
  "Rain-d": "rain.jpg",
  "Rain-n": "rain.jpg",
  "Snow-d": "snowing-day.jpg",
  "Snow-n": "snowy-winter-night.jpg",
  "Thunderstorm-d": "thunderstorm.jpg",
  "Thunderstorm-n": "thunderstorm.jpg",
};

// -------------------- DOM Elements --------------------
const searchForm = document.querySelector<HTMLFormElement>(".search-form")!;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const spinner = document.getElementById("spinner")!;
const weekDaysContainer = document.querySelector(".week-days")!;

// -------------------- API Functions --------------------
async function getWeatherData(city: string) {
  const currentRes = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${API_KEY}`
  );
  if (!currentRes.ok) throw new Error("City not found");
  const currentData: CurrentWeatherData = await currentRes.json();

  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${API_KEY}`
  );
  if (!forecastRes.ok) throw new Error("Forecast fetch failed");
  const forecastData: ForecastData = await forecastRes.json();

  return { current: currentData, forecast: forecastData };
}

// -------------------- Render Current Weather --------------------
function renderCurrentWeather(current: CurrentWeatherData) {
  const condition = current.weather[0]!.main;
  const iconCode = current.weather[0]!.icon;
  const timeOfDay = iconCode.endsWith("n") ? "n" : "d";

  setBackground(condition, timeOfDay);

  const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const iconImg = document.querySelector<HTMLImageElement>(
    "#weather-main-info img"
  )!;
  iconImg.src = iconURL;
  iconImg.alt = current.weather[0]!.description;

  document.querySelector("#weather-main-info h1")!.textContent = `${Math.round(
    current.main.temp
  )}°C`;
  document.querySelector("#weather-main-info h2")!.textContent = current.name;

  const timezoneOffset = current.timezone; // in seconds
  const localDate = new Date(Date.now() + timezoneOffset * 1000);

  const hours = localDate.getUTCHours().toString().padStart(2, "0");
  const minutes = localDate.getUTCMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;
  const dateStr = localDate.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const fullDateTime = `${timeStr} - ${dateStr}`;
  document.querySelector("#weather-main-info span")!.textContent = fullDateTime;

  document.getElementById("temp-max")!.textContent = `${Math.round(
    current.main.temp_max
  )}°C`;
  document.getElementById("temp-min")!.textContent = `${Math.round(
    current.main.temp_min
  )}°C`;
  document.getElementById(
    "humidity"
  )!.textContent = `${current.main.humidity}%`;
  document.getElementById("cloudiness")!.textContent = `${current.clouds.all}%`;
  document.getElementById("wind")!.textContent = `${current.wind.speed} m/s`;
}

// -------------------- Render Forecast --------------------
function renderForecast(forecast: ForecastData) {
  weekDaysContainer.innerHTML = "";

  const dailyMap: Record<string, ForecastItem> = {};

  forecast.list.forEach((item) => {
    // Ensure dt_txt exists
    if (!item.dt_txt) return;

    const parts = item.dt_txt.split(" ");
    if (parts.length < 2) return;

    const date = parts[0]; // now guaranteed to be a string
    const hour = parts[1];

    if (hour === "12:00:00") {
      dailyMap[date!] = item; // safe now
    }
  });

  const dailyEntries = Object.entries(dailyMap).slice(0, 7);
  dailyEntries.forEach(([date, data]) => {
    const condition = data.weather?.[0]?.main || "Clear";
    const iconCode = data.weather[0]!.icon;
    const description = data.weather[0]!.description;
    const temp = Math.round(data.main.temp);

    const dayName = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <h3>${dayName}</h3>
      <img src="${iconURL}" alt="${description}" />
      <p>${temp}°C</p>
      <p>${description}</p>
    `;
    weekDaysContainer.appendChild(card);
  });
}

// -------------------- Background --------------------
function setBackground(condition: string, timeOfDay: string) {
  const key = `${condition}-${timeOfDay}`;
  const bgImage = backgrounds[key] || "default.jpg";
  const backgroundLayer = document.getElementById("background-layer")!;
  backgroundLayer.style.backgroundImage = `url('./assets/media/bg-images/${bgImage}')`;
}

// Preload images
Object.values(backgrounds).forEach((img) => {
  const preload = new Image();
  preload.src = `./assets/media/bg-images/${img}`;
});

// -------------------- Event Listeners --------------------
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (!city) return;

  spinner.classList.remove("hidden");
  try {
    const weatherData = await getWeatherData(city);
    renderCurrentWeather(weatherData.current);
    renderForecast(weatherData.forecast);
  } catch (err) {
    alert("Error fetching weather. Try another city.");
    console.error(err);
  } finally {
    spinner.classList.add("hidden");
  }
});

// -------------------- Initial Load --------------------
window.addEventListener("DOMContentLoaded", async () => {
  const defaultCity = "Batumi";
  spinner.classList.remove("hidden");
  try {
    const weatherData = await getWeatherData(defaultCity);
    renderCurrentWeather(weatherData.current);
    renderForecast(weatherData.forecast);
    searchInput.value = defaultCity;
  } catch (err) {
    console.error("Error loading default city:", err);
  } finally {
    spinner.classList.add("hidden");
  }
});
