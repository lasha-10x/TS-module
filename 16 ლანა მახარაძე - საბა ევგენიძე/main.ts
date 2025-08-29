// main.ts

const API_KEY: string = "3b9a7f516d45030744c61efad1ca35a9";
const BASE_URL: string = "https://api.openweathermap.org/data/2.5/";

// --- DOM elements ---
const cityInput = document.getElementById("city-input") as HTMLInputElement;
const currentTemp = document.getElementById("current-temp") as HTMLElement;
const currentCity = document.getElementById("current-city") as HTMLElement;
const currentCondition = document.getElementById(
  "current-condition"
) as HTMLElement;
const weatherIcon = document.getElementById("weather-icon") as HTMLImageElement;
const humidityValue = document.getElementById("humidity-value") as HTMLElement;
const windSpeedValue = document.getElementById(
  "wind-speed-value"
) as HTMLElement;
const pressureValue = document.getElementById("pressure-value") as HTMLElement;
const visibilityValue = document.getElementById(
  "visibility-value"
) as HTMLElement;
const hourlyCardsContainer = document.getElementById(
  "hourly-cards-container"
) as HTMLElement;
const dailyCardsContainer = document.getElementById(
  "daily-cards-container"
) as HTMLElement;
const windArrow = document.getElementById("wind-arrow") as HTMLElement;
const windSpeedCompass = document.getElementById(
  "wind-speed-compass"
) as HTMLElement;
const messageBox = document.getElementById("message-box") as HTMLElement;
const messageText = document.getElementById("message-text") as HTMLElement;

// --- Types for API responses ---
interface WeatherDescription {
  description: string;
  icon: string;
}

interface MainWeather {
  temp: number;
  humidity: number;
  pressure: number;
  feels_like: number;
}

interface Wind {
  speed: number;
  deg: number;
}

interface CurrentWeatherData {
  name: string;
  main: MainWeather;
  weather: WeatherDescription[];
  visibility: number;
  wind: Wind;
}

interface ForecastItem {
  dt: number;
  main: MainWeather;
  weather: WeatherDescription[];
}

interface ForecastData {
  list: ForecastItem[];
}

// --- Utilities ---
function displayMessage(message: string, isError: boolean = true): void {
  messageText.textContent = message;
  messageBox.style.display = "block";
  messageBox.style.backgroundColor = isError ? "#dc2626" : "#16a34a";

  clearTimeout((displayMessage as any).timeoutId);
  (displayMessage as any).timeoutId = setTimeout(() => {
    messageBox.style.display = "none";
  }, 5000);
}

async function fetchWeather(
  endpoint: string,
  city: string
): Promise<any | null> {
  try {
    const response = await fetch(
      `${BASE_URL}${endpoint}?q=${encodeURIComponent(
        city
      )}&appid=${API_KEY}&units=metric&lang=ka`
    );
    if (!response.ok) {
      switch (response.status) {
        case 404:
          displayMessage(
            `ქალაქი არ მოიძებნა: "${city}". გადაამოწმეთ შეყვანილი ტექსტი.`
          );
          break;
        case 401:
          displayMessage(
            "არასწორი ან გამოტოვებული API გასაღები. გთხოვთ შეამოწმოთ API გასაღები."
          );
          break;
        default:
          displayMessage(`Error ${response.status}: ${response.statusText}`);
      }
      return null;
    }
    return await response.json();
  } catch (err: any) {
    displayMessage(
      `Network error: ${err.message}. შეამოწმე თქვენი ინტერნეტ კავშირი.`
    );
    return null;
  }
}

function updateCurrentWeatherUI(data: CurrentWeatherData): void {
  currentTemp.textContent = `${Math.round(data.main.temp)}°C`;
  currentCity.textContent = data.name;
  currentCondition.textContent = capitalize(data.weather[0]!.description);
  weatherIcon.src = `https://openweathermap.org/img/wn/${
    data.weather[0]!.icon
  }@2x.png`;
  weatherIcon.alt = data.weather[0]!.description;

  humidityValue.textContent = `${data.main.humidity}%`;
  windSpeedValue.textContent = `${data.wind.speed.toFixed(1)} მ/წმ`;
  pressureValue.textContent = `${data.main.pressure} პოდი`;
  visibilityValue.textContent = `${(data.visibility / 1000).toFixed(1)} კმ`;

  if (typeof data.wind.deg === "number") {
    windArrow.style.transform = `rotate(${data.wind.deg}deg)`;
  }
  windSpeedCompass.textContent = data.wind.speed.toFixed(1);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createForecastCard({
  time,
  icon,
  description,
  temp,
  dayName,
  monthDay,
}: {
  time?: string;
  icon: string;
  description: string;
  temp: number;
  dayName?: string;
  monthDay?: string;
}): HTMLElement {
  const card = document.createElement("div");
  card.classList.add("forecast-card");

  card.innerHTML = `
    ${time ? `<div class="time">${time}</div>` : ""}
    ${dayName ? `<div class="date">${dayName}</div>` : ""}
    ${monthDay ? `<div class="date">${monthDay}</div>` : ""}
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
    <div class="temp">${temp}°C</div>
  `;
  return card;
}

function populateHourlyForecast(forecastData: ForecastData): void {
  hourlyCardsContainer.innerHTML = "";
  const now = Date.now();

  const nextHours = forecastData.list
    .filter((item) => item.dt * 1000 > now)
    .slice(0, 8)
    .map((item) => {
      const date = new Date(item.dt * 1000);
      return createForecastCard({
        time: date.toLocaleTimeString("ka-GE", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        icon: item.weather[0]!.icon,
        description: item.weather[0]!.description,
        temp: Math.round(item.main.temp),
      });
    });

  nextHours.forEach((card) => hourlyCardsContainer.appendChild(card));
}

function populateDailyForecast(forecastData: ForecastData): void {
  dailyCardsContainer.innerHTML = "";
  const todayStr = new Date().toDateString();
  const dailyMap: Record<string, ForecastItem> = {};

  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateStr = date.toDateString();
    if (dateStr === todayStr || dailyMap[dateStr]) return;
    if (date.getHours() >= 11 && date.getHours() <= 13) {
      dailyMap[dateStr] = item;
    }
  });

  Object.values(dailyMap)
    .slice(0, 5)
    .forEach((item) => {
      const date = new Date(item.dt * 1000);
      dailyCardsContainer.appendChild(
        createForecastCard({
          dayName: date.toLocaleDateString("ka-GE", { weekday: "short" }),
          monthDay: date.toLocaleDateString("ka-GE", {
            month: "2-digit",
            day: "2-digit",
          }),
          icon: item.weather[0]!.icon,
          description: item.weather[0]!.description,
          temp: Math.round(item.main.temp),
        })
      );
    });
}

async function getWeatherData(city: string): Promise<void> {
  if (!API_KEY) {
    displayMessage("გთხოვ დაამატეთ თქვენი OpenWeatherMap API გასაღები.", true);
    return;
  }
  displayMessage("ამინდის მონაცემების მიღება...", false);

  const [currentData, forecastData] = await Promise.all([
    fetchWeather("weather", city),
    fetchWeather("forecast", city),
  ]);

  if (currentData) {
    updateCurrentWeatherUI(currentData as CurrentWeatherData);
  } else {
    resetCurrentWeatherUI();
  }

  if (forecastData) {
    populateHourlyForecast(forecastData as ForecastData);
    populateDailyForecast(forecastData as ForecastData);
  } else {
    hourlyCardsContainer.innerHTML = "";
    dailyCardsContainer.innerHTML = "";
  }

  if (currentData || forecastData) {
    messageBox.style.display = "none";
  }
}

function resetCurrentWeatherUI(): void {
  currentTemp.textContent = "--°C";
  currentCity.textContent = "N/A";
  currentCondition.textContent = "N/A";
  weatherIcon.src = "";
  weatherIcon.alt = "ამინდის icon არ არსებობს";
  humidityValue.textContent = "--%";
  windSpeedValue.textContent = "-- m/s";
  pressureValue.textContent = "-- hPa";
  visibilityValue.textContent = "-- km";
  windArrow.style.transform = "rotate(0deg)";
  windSpeedCompass.textContent = "--";
}

// --- Event listeners ---
cityInput.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
      cityInput.value = "";
    } else {
      displayMessage("შეიყვანე ქალაქის სახელი");
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  getWeatherData("Batumi");
});
