// weatherApp.ts

const apiKey = "e96f98a7a2898c4e4f62aee037961831";

// -----------------------------
// Types
// -----------------------------
interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
}

interface WeatherListItem {
  dt: number;
  dt_txt: string;
  main: MainWeatherData;
  weather: WeatherCondition[];
}

interface CityInfo {
  name: string;
  [key: string]: unknown;
}

interface WeatherData {
  city: CityInfo;
  list: WeatherListItem[];
}

interface ForecastItem {
  day_today: string | undefined;
  temperature: string;
  description: string;
  weatherImg: string;
}

// -----------------------------
// Utility Functions
// -----------------------------
function getElement<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id "${id}" not found`);
  return el as T;
}

function getWeatherImageSrc(condition: string): string {
  const key = condition.toLowerCase();
  switch (key) {
    case "rain":
      return "img/rain.png";
    case "clear":
    case "clear sky":
      return "img/sun.png";
    case "snow":
      return "img/snow.png";
    case "clouds":
    case "smoke":
      return "img/cloud.png";
    case "mist":
    case "fog":
      return "img/mist.png";
    case "haze":
      return "img/haze.png";
    case "thunderstorm":
      return "img/thunderstorm.png";
    default:
      return "img/sun.png";
  }
}

// -----------------------------
// Display Forecast
// -----------------------------
function displayForecast(data: WeatherData): void {
  const dailyForecasts: Record<string, ForecastItem> = {};
  const forecastEl = getElement<HTMLDivElement>("future-forecast-box");
  let forecastHTML = "";

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = new Date(date!).getDay();

    if (!dailyForecasts[date!]) {
      dailyForecasts[date!] = {
        day_today: dayNames[dayIndex],
        temperature: `${Math.floor(item.main.temp)}°`,
        description: item.weather[0]!.description,
        weatherImg: item.weather[0]!.main,
      };
    }
  });

  for (const date in dailyForecasts) {
    const forecast = dailyForecasts[date];
    const imgSrc = getWeatherImageSrc(forecast!.weatherImg);

    forecastHTML += `
      <div class="weather-forecast-box">
        <div class="day-weather">
          <span>${forecast!.day_today}</span>
        </div>
        <div class="weather-icon-forecast">
          <img src="${imgSrc}" />
        </div>
        <div class="temp-weather">
          <span>${forecast!.temperature}</span>
        </div>
        <div class="weather-main-forecast">${forecast!.description}</div>
      </div>
    `;
  }

  forecastEl.innerHTML = forecastHTML;
}

// -----------------------------
// Main Function
// -----------------------------
async function loadWeather(): Promise<void> {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Get city name from coordinates
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
        );
        const geoData = await geoRes.json();
        const loc: string = geoData[0]?.name;
        if (!loc) throw new Error("Unable to determine city from coordinates");

        // Get weather data
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${loc}&units=metric&appid=${apiKey}`
        );
        const weatherData: WeatherData = await weatherRes.json();

        console.log(weatherData);

        // Display current weather
        const cityMain = getElement<HTMLDivElement>("city-name");
        const cityTemp = getElement<HTMLDivElement>("metric");
        const weatherMain =
          document.querySelectorAll<HTMLDivElement>("#weather-main");
        const mainHumidity = getElement<HTMLDivElement>("humidity");
        const mainFeel = getElement<HTMLDivElement>("feels-like");
        const weatherImg = getElement<HTMLImageElement>("weather-icon");
        const weatherImgs = getElement<HTMLImageElement>("weather-icons");
        const tempMinWeather = getElement<HTMLDivElement>("temp-min-today");
        const tempMaxWeather = getElement<HTMLDivElement>("temp-max-today");

        const current = weatherData.list[0];
        cityMain.innerText = weatherData.city.name;
        cityTemp.innerText = `${Math.floor(current!.main.temp)}°`;
        weatherMain[0]!.innerText = current!.weather[0]!.description;
        weatherMain[1]!.innerText = current!.weather[0]!.description;
        mainHumidity.innerText = `${Math.floor(current!.main.humidity)}`;
        mainFeel.innerText = `${Math.floor(current!.main.feels_like)}`;
        tempMinWeather.innerText = `${Math.floor(current!.main.temp_min)}°`;
        tempMaxWeather.innerText = `${Math.floor(current!.main.temp_max)}°`;

        const weatherCondition = current!.weather[0]!.main;
        const imgSrc = getWeatherImageSrc(weatherCondition);
        weatherImg.src = imgSrc;
        weatherImgs.src = imgSrc;

        // Display 5-day forecast
        displayForecast(weatherData);
      } catch (error) {
        console.error("An error occurred:", error);
        alert("Failed to load weather data. Please try again later.");
      }
    },
    () => {
      alert("Please enable location services and refresh the page.");
    }
  );
}

// -----------------------------
// Init
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadWeather();
});
