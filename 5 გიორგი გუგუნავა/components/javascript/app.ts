// types.ts
export interface CityData {
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
  list: Array<{
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    wind: {
      speed: number;
    };
    visibility: number;
    weather: Array<{ main: string }>;
  }>;
}

interface ForecastDay {
  maxTemp: number;
  minTemp: number;
  weather: string;
  dayName: string;
}

// utils.ts
export const KelvinToCelsius = (k: number): string =>
  `${Math.round(k - 273.15)}°C`;
export const KelvinToFahrenheit = (k: number): string =>
  `${Math.round(((k - 273.15) * 9) / 5 + 32)}°F`;
export const calculateVisibility = (m: number): string =>
  `${(m / 1000).toFixed(1)} km`;

export const getWeatherIcon = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case "rain":
      return "src/icons/rain.svg";
    case "snow":
      return "src/icons/snow.svg";
    case "clouds":
      return "src/icons/cloud.svg";
    case "clear":
      return "src/icons/sun.svg";
    default:
      return "src/icons/cloud.svg";
  }
};

declare global {
  interface Window {
    showLoader?: () => void;
    hideLoader?: () => void;
  }
}

const apiKey = "YOUR_API_KEY_HERE";
const search = document.getElementById("search") as HTMLInputElement;
const SEARCH_BTN = document.getElementById("search-btn") as HTMLButtonElement;
const city = document.querySelector(".city") as HTMLElement;
const COUNTRY_CODE = document.querySelector(".country") as HTMLElement;
const temp = document.querySelector(".temp") as HTMLElement;
const WEATHER_INFO = document.querySelector(".weather-info") as HTMLElement;
const HUMIDITY_INDEX = document.querySelector(".humidity") as HTMLElement;
const WIND_SPEED_INDEX = document.querySelector(".wind") as HTMLElement;
const PRESSURE_INDEX = document.querySelector(".pressure") as HTMLElement;
const FEELS_LIKE_INDEX = document.querySelector(".feels-like") as HTMLElement;
const VISIBILITY_INDEX = document.querySelector(".visibility") as HTMLElement;
const SUNRISE_TIME = document.querySelector(".sunrise") as HTMLElement;
const SUNSET_TIME = document.querySelector(".sunset") as HTMLElement;
const MAX_TEMPERATURE = document.querySelectorAll<HTMLElement>(".max-temp");
const MIN_TEMPERATURE = document.querySelectorAll<HTMLElement>(".min-temp");
const DAY_WEATHER = document.querySelectorAll<HTMLElement>(".day-weather");
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let currentWeatherData: CityData | null = null;
let isFahrenheit = false;

const fetchData = async (cityName: string): Promise<CityData> => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 500) throw new Error("SERVER_ERROR");
      throw new Error("API_ERROR");
    }
    const data = await res.json();
    if (data.cod && data.cod !== "200") throw new Error("API_ERROR");
    return data;
  } catch (error: any) {
    if (error.name === "TypeError" && error.message.includes("fetch"))
      throw new Error("NETWORK_ERROR");
    throw error;
  }
};

const renderTodayWeather = (cities: CityData) => {
  const cityName = `${cities.city.name},`;
  const countryCode = cities.city.country;
  const weatherCondition = cities.list[0]!.weather[0]!.main;
  const weatherTemp = isFahrenheit
    ? KelvinToFahrenheit(cities.list[0]!.main.temp)
    : KelvinToCelsius(cities.list[0]!.main.temp);
  const feelsLikeTemp = isFahrenheit
    ? KelvinToFahrenheit(cities.list[0]!.main.feels_like)
    : KelvinToCelsius(cities.list[0]!.main.feels_like);
  const humidity = `${cities.list[0]!.main.humidity}%`;
  const windSpeed = `${cities.list[0]!.wind.speed} km/h`;
  const pressure = `${cities.list[0]!.main.pressure} hPa`;
  const visibility = calculateVisibility(cities.list[0]!.visibility);
  const sunriseTimestamp = new Date(cities.city.sunrise * 1000);
  const sunsetTimestamp = new Date(cities.city.sunset * 1000);
  const sunriseTime = `${sunriseTimestamp.getHours()}:${sunriseTimestamp.getMinutes()}`;
  const sunsetTime = `${sunsetTimestamp.getHours()}:${sunsetTimestamp.getMinutes()}`;
  const weatherIcon = getWeatherIcon(weatherCondition);
  const mainWeatherIcon =
    document.querySelector<HTMLImageElement>(".city_weather img");

  city.textContent = cityName;
  COUNTRY_CODE.textContent = countryCode;
  temp.textContent = weatherTemp;
  WEATHER_INFO.textContent = weatherCondition;
  HUMIDITY_INDEX.textContent = humidity;
  WIND_SPEED_INDEX.textContent = windSpeed;
  PRESSURE_INDEX.textContent = pressure;
  FEELS_LIKE_INDEX.textContent = feelsLikeTemp;
  VISIBILITY_INDEX.textContent = visibility;
  SUNRISE_TIME.textContent = sunriseTime;
  SUNSET_TIME.textContent = sunsetTime;

  if (mainWeatherIcon) mainWeatherIcon.src = weatherIcon;
};

const renderForecast = (cities: CityData) => {
  const dailyForecasts: ForecastDay[] = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const dayStart = i * 8;
    const dayEnd = dayStart + 8;
    const dayData = cities.list.slice(dayStart, dayEnd);

    if (dayData.length > 0) {
      // Fix implicit any by typing item
      const temperatures: number[] = dayData.map(
        (item: (typeof dayData)[0]) => item.main.temp
      );

      const maxTemp = Math.max(...temperatures);
      const minTemp = Math.min(...temperatures);

      const forecastDate = new Date(today);
      forecastDate.setDate(today.getDate() + i);

      // Force string type using '|| "Unknown"'
      const dayName: string =
        i === 0
          ? "Today"
          : i === 1
          ? "Tomorrow"
          : days[forecastDate.getDay()] || "Unknown";

      dailyForecasts.push({
        maxTemp,
        minTemp,
        weather: dayData[0]!.weather[0]!.main,
        dayName,
      });
    }
  }

  dailyForecasts.forEach((dayForecast, index) => {
    const maxTempEl = MAX_TEMPERATURE[index];
    const minTempEl = MIN_TEMPERATURE[index];
    const dayWeatherEl = DAY_WEATHER[index];
    const dayNameEl =
      document.querySelectorAll<HTMLElement>(".days .day")[index];

    if (maxTempEl)
      maxTempEl.textContent = isFahrenheit
        ? KelvinToFahrenheit(dayForecast.maxTemp)
        : KelvinToCelsius(dayForecast.maxTemp);
    if (minTempEl)
      minTempEl.textContent = isFahrenheit
        ? KelvinToFahrenheit(dayForecast.minTemp)
        : KelvinToCelsius(dayForecast.minTemp);
    if (dayWeatherEl) dayWeatherEl.textContent = dayForecast.weather;
    if (dayNameEl) dayNameEl.textContent = dayForecast.dayName;
  });
};

const searchCity = async () => {
  const searchedCity = search.value.trim();
  const errorMessage = document.getElementById("error_message");
  const serverErrorMessage = document.getElementById("server_error_message");
  const input = search;

  input.classList.remove("error");
  errorMessage?.classList.remove("error");
  serverErrorMessage?.classList.remove("server_error");

  if (!searchedCity) return;

  try {
    window.showLoader?.();
    const cities = await fetchData(searchedCity);
    currentWeatherData = cities;
    renderTodayWeather(cities);
    renderForecast(cities);
  } catch (error: any) {
    input.classList.add("error");
    errorMessage?.classList.add("error");
    if (error.message === "NETWORK_ERROR" || error.message === "SERVER_ERROR") {
      serverErrorMessage?.classList.add("server_error");
    }
    console.error("Error fetching weather data:", error);
  } finally {
    window.hideLoader?.();
  }
};

search.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchCity();
});
document.addEventListener("DOMContentLoaded", () => {
  const SEARCH_BTN = document.getElementById(
    "search_btn"
  ) as HTMLButtonElement | null;

  if (SEARCH_BTN) {
    SEARCH_BTN.addEventListener("click", searchCity);
  }
});

// Initial render
const renderHtml = async () => {
  try {
    window.showLoader?.();
    const cities = await fetchData("Batumi");
    currentWeatherData = cities;
    renderTodayWeather(cities);
    renderForecast(cities);
  } catch (error: any) {
    if (error.message === "NETWORK_ERROR" || error.message === "SERVER_ERROR") {
      document
        .getElementById("server_error_message")
        ?.classList.add("server_error");
    }
    console.error("Error loading initial weather data:", error);
  } finally {
    window.hideLoader?.();
  }
};

renderHtml();
