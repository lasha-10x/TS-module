const apiKey: string = "ba9bc6d611f2998aa1fa56af94929acd";
const defaultCity: string = "Batumi";
let currentUnit: "metric" | "imperial" = "metric";
let lastCity: string = defaultCity;

// API response types
interface WeatherApiResponse {
  name: string;
  timezone: number;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    main: string;
    icon: string;
  }[];
}

interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: { temp: number };
  weather: { icon: string; description: string }[];
}

// Loader
function showLoader(): void {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "block";
}

function hideLoader(): void {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
}

// Fetch current weather
async function fetchWeather(city: string): Promise<void> {
  const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;

  showLoader();

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("City not found");
    const data: WeatherApiResponse = await response.json();

    (document.querySelector("h2") as HTMLElement).textContent = data.name;
    (
      document.querySelector(".temp") as HTMLElement
    ).textContent = `${Math.round(data.main.temp)}${unitSymbol}`;
    (document.querySelector(".description") as HTMLElement).textContent =
      data.weather[0]?.description ?? "N/A";

    const iconCode = data.weather[0]?.icon ?? "01d";
    const weatherImg = document.querySelector(
      ".weather-info img"
    ) as HTMLImageElement;
    if (weatherImg) {
      weatherImg.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }

    const localTime = getLocalTime(data.timezone);
    (document.querySelector(".current-date") as HTMLElement).textContent =
      localTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    (document.querySelector(".current-time") as HTMLElement).textContent =
      localTime.toTimeString().slice(0, 5);

    updateTimeBackground(data.weather[0]?.main ?? "Clear");
    updateBackground(data.timezone);
  } catch (error) {
    console.error(error);
    (
      document.querySelector(".time") as HTMLElement
    ).innerHTML = `<p>City not found</p>`;
  } finally {
    hideLoader();
  }
}

// Local Time (based on timezone)
function getLocalTime(timezoneOffsetInSeconds: number): Date {
  const nowUTC = new Date(
    new Date().getTime() + new Date().getTimezoneOffset() * 60000
  );
  return new Date(nowUTC.getTime() + timezoneOffsetInSeconds * 1000);
}

// Background update by weather
function updateTimeBackground(weatherMain: string): void {
  const timeDiv = document.querySelector(".time") as HTMLElement | null;
  if (!timeDiv) return;

  const gradients: Record<"sunny" | "cloudy", string> = {
    sunny: "linear-gradient(to bottom, #e0f7fa, #80deea)",
    cloudy: "linear-gradient(rgb(174, 190, 200), rgb(120 135 144))",
  };

  const sunnyConditions = ["Clear", "Sunny"];
  const cloudyConditions = [
    "Clouds",
    "Rain",
    "Drizzle",
    "Thunderstorm",
    "Snow",
    "Mist",
    "Fog",
    "Haze",
  ];

  if (sunnyConditions.includes(weatherMain)) {
    timeDiv.style.background = gradients.sunny ?? "";
  } else if (cloudyConditions.includes(weatherMain)) {
    timeDiv.style.background = gradients.cloudy ?? "";
  } else {
    timeDiv.style.background = gradients.sunny ?? "";
  }
}

// Day/Night BG
function updateBackground(timezoneOffset: number): void {
  const currentWeather = document.querySelector(
    ".current-weather"
  ) as HTMLElement | null;
  if (!currentWeather) return;

  const localTime = getLocalTime(timezoneOffset);
  const hour = localTime.getHours();

  if (hour >= 6 && hour < 20) {
    currentWeather.style.backgroundImage = "url('./media/day.jpg')";
    currentWeather.style.color = "black";
  } else {
    currentWeather.style.backgroundImage = "url('./media/night.jpg')";
    currentWeather.style.color = "white";
  }
}

// 5-day forecast
async function fetchForecast(city: string): Promise<void> {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`;

  showLoader();

  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    const forecastContainer = document.querySelector(
      ".forecast-cards"
    ) as HTMLElement;
    forecastContainer.innerHTML = "";

    const grouped: Record<string, ForecastItem[]> = {};
    (data.list as ForecastItem[]).forEach((item) => {
      const date = item.dt_txt?.split(" ")[0];
      if (!date) return;
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    Object.entries(grouped)
      .slice(0, 5)
      .forEach(([date, entries]) => {
        const temps = entries.map((e) => e.main.temp);
        const iconEntry =
          entries.find((e) => e.dt_txt.includes("12:00:00")) || entries[0];
        const icon = iconEntry!.weather[0]?.icon ?? "01d";
        const desc = iconEntry!.weather[0]?.description ?? "";

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
        <p>${new Date(date).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
        <p>${Math.round(Math.min(...temps))}° / ${Math.round(
          Math.max(...temps)
        )}°</p>`;
        forecastContainer.appendChild(card);
      });
  } catch (err) {
    console.error(err);
    (
      document.querySelector(".forecast-cards") as HTMLElement
    ).innerHTML = `<p>Forecast not available</p>`;
  } finally {
    hideLoader();
  }
}

// Hourly forecast
async function fetchHourlyForecast(city: string): Promise<void> {
  const hourlyUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${currentUnit}`;

  showLoader();

  try {
    const response = await fetch(hourlyUrl);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    const hourlyContainer = document.querySelector(
      ".hourly-cards"
    ) as HTMLElement;
    hourlyContainer.innerHTML = "";

    const upcoming = (data.list as ForecastItem[])
      .filter((item) => item.dt * 1000 > Date.now())
      .slice(0, 6);

    upcoming.forEach((item) => {
      const time = new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const temp = Math.round(item.main.temp);
      const icon = item.weather[0]?.icon ?? "01d";
      const desc = item.weather[0]?.description ?? "";

      const card = document.createElement("div");
      card.className = "hour-card";
      card.innerHTML = `
        <p>${time}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" />
        <p>${temp}°</p>
      `;
      hourlyContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    (
      document.querySelector(".hourly-cards") as HTMLElement
    ).innerHTML = `<p>Forecast not available</p>`;
  } finally {
    hideLoader();
  }
}

// Search
function searchCityWeather(): void {
  const cityInput = document.getElementById("city-input") as HTMLInputElement;
  const city = cityInput.value.trim();
  if (city) {
    lastCity = city;
    fetchWeather(city);
    fetchForecast(city);
    fetchHourlyForecast(city);
  }
}

// Event Listeners
(document.getElementById("search-btn") as HTMLElement).addEventListener(
  "click",
  searchCityWeather
);
(document.getElementById("city-input") as HTMLInputElement).addEventListener(
  "keypress",
  (e: KeyboardEvent) => {
    if (e.key === "Enter") searchCityWeather();
  }
);
(document.getElementById("unit-switch") as HTMLInputElement).addEventListener(
  "change",
  () => {
    currentUnit = (document.getElementById("unit-switch") as HTMLInputElement)
      .checked
      ? "imperial"
      : "metric";
    fetchWeather(lastCity);
    fetchForecast(lastCity);
    fetchHourlyForecast(lastCity);
  }
);
(document.getElementById("dark-mode-toggle") as HTMLElement).addEventListener(
  "click",
  () => {
    (document.querySelector(".time") as HTMLElement).classList.toggle(
      "dark-mode"
    );
    document.body.classList.toggle("dark-mode");
  }
);

// Initial Load
fetchWeather(defaultCity);
fetchForecast(defaultCity);
fetchHourlyForecast(defaultCity);
