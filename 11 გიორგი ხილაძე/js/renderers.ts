// renderers.ts
import { getDOMElements } from "./domElements";
import {
  mapWeatherConditionToVideo,
  getWeatherIconUrl,
  getRandomizedTime,
} from "./dataUtils";

// ---------------- Types ----------------

interface WeatherMain {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
}

interface WeatherWind {
  speed: number;
}

interface WeatherSys {
  sunrise: number;
  sunset: number;
}

interface WeatherDescription {
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  name: string;
  main: WeatherMain;
  wind: WeatherWind;
  visibility: number;
  sys: WeatherSys;
  weather: WeatherDescription[];
}

export interface ForecastItem {
  dt: number;
  main: { temp: number };
  weather: WeatherDescription[];
  dateString: string;
}

// ---------------- Elements ----------------
let elements: ReturnType<typeof getDOMElements>;

// ---------------- Functions ----------------

export function initRenderersElements(): void {
  elements = getDOMElements();
}

export function updateBackgroundVideo(weatherMainCondition: string): void {
  if (elements?.videoSourceElement && elements.videoElement) {
    const newVideoSrc = mapWeatherConditionToVideo(weatherMainCondition);

    if (elements.videoSourceElement.src !== newVideoSrc) {
      elements.videoSourceElement.src = newVideoSrc;
      elements.videoElement.load();
      elements.videoElement.play().catch((error) => {
        console.error("Video auto-play failed:", error);
      });
    }
  }
}

export function displayCurrentWeather(weatherData: WeatherData): void {
  if (!weatherData) return;

  const {
    cityNameElement,
    temperatureElement,
    feelsLikeElement,
    windSpeedElement,
    humidityElement,
    visibilityElement,
    pressureElement,
    sunriseElement,
    sunsetElement,
    weatherDescriptionElement,
    airQualityElement,
    uvIndexElement,
  } = elements;

  if (cityNameElement) cityNameElement.textContent = weatherData.name;
  if (temperatureElement)
    temperatureElement.textContent = `${Math.round(weatherData.main.temp)}°C`;
  if (feelsLikeElement)
    feelsLikeElement.textContent = `${Math.round(
      weatherData.main?.feels_like
    )}°C`;
  if (windSpeedElement)
    windSpeedElement.textContent = `${Math.round(
      weatherData.wind?.speed * 3.6
    )} km/h`;
  if (humidityElement)
    humidityElement.textContent = `${weatherData.main?.humidity}%`;
  if (visibilityElement)
    visibilityElement.textContent = `${(weatherData.visibility / 1000).toFixed(
      1
    )} km`;
  if (pressureElement)
    pressureElement.textContent = `${weatherData.main?.pressure} hPa`;

  let sunriseTime = "--:--";
  let sunsetTime = "--:--";

  if (weatherData.sys?.sunrise && weatherData.sys?.sunset) {
    const sunriseDate = new Date(weatherData.sys.sunrise * 1000);
    const sunsetDate = new Date(weatherData.sys.sunset * 1000);

    sunriseTime = sunriseDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    sunsetTime = sunsetDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (sunriseElement) sunriseElement.textContent = sunriseTime;
    if (sunsetElement) sunsetElement.textContent = sunsetTime;
  } else {
    if (sunriseElement) sunriseElement.textContent = "--:--";
    if (sunsetElement) sunsetElement.textContent = "--:--";
  }

  if (weatherDescriptionElement) {
    const descriptionText = weatherData.weather[0]?.description || "N/A";
    weatherDescriptionElement.innerHTML = `
            ${descriptionText}<br>
            Sunrise: ${sunriseTime}<br>
            Sunset: ${sunsetTime}
        `;
  }

  if (airQualityElement) {
    const airQualityOptions = ["Good", "Fair", "Moderate"];
    const randomAQIndex = Math.floor(Math.random() * airQualityOptions.length);
    const airQualityText = airQualityOptions[randomAQIndex];

    airQualityElement.innerHTML = `Air Quality - <span class="air-quality-status">${airQualityText}</span>`;
  }

  if (uvIndexElement) {
    const uvIndex = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
    uvIndexElement.textContent = `UV : ${uvIndex}`;
  }
}

export function displayFiveDayForecast(
  processedForecastData: ForecastItem[],
  currentSunriseUnix?: number,
  currentSunsetUnix?: number
): void {
  if (!elements?.forecastContainer) {
    console.error("Forecast container (.week-weather) not found.");
    return;
  }

  elements.forecastContainer.innerHTML = "";

  if (!processedForecastData || processedForecastData.length === 0) {
    return;
  }

  const currentSunriseDate = currentSunriseUnix
    ? new Date(currentSunriseUnix * 1000)
    : null;
  const currentSunsetDate = currentSunsetUnix
    ? new Date(currentSunsetUnix * 1000)
    : null;

  processedForecastData.forEach((dayData) => {
    const forecastCard = document.createElement("li");
    const displayDate = dayData.dateString;
    const owmIconCode = dayData.weather[0]!.icon;
    const iconUrl = getWeatherIconUrl(owmIconCode);
    const temperature = Math.round(dayData.main.temp);
    const simulatedSunriseTime = getRandomizedTime(currentSunriseDate, 10, 15);
    const simulatedSunsetTime = getRandomizedTime(currentSunsetDate, 10, 15);

    forecastCard.innerHTML = `
            <span>${displayDate}</span>
            <img src="${iconUrl}" alt="Weather icon">
            <span class="forecast-temp">${temperature}°C</span>
            <div class="sunset">
                <span>Sunrise/Sunset</span>
                <div>
                    <img src="./assets/sunUp.svg" alt="Sunrise icon">
                    <img src="./assets/sunDown.svg" alt="Sunset icon">
                </div>
                <span>${simulatedSunriseTime} / ${simulatedSunsetTime}</span>
            </div>
        `;
    elements.forecastContainer!.appendChild(forecastCard);
  });
}
