// domElements.ts

// -----------------------------
// Types for DOM Elements
// -----------------------------
export interface DOMElements {
  cityInput: HTMLInputElement | null;
  searchButton: HTMLButtonElement | null;
  errorMessageElement: HTMLElement | null;
  loaderWrapper: HTMLElement | null;
  videoElement: HTMLVideoElement | null;
  videoSourceElement: HTMLSourceElement | null;

  // Current Weather elements
  cityNameElement: HTMLElement | null;
  temperatureElement: HTMLElement | null;
  feelsLikeElement: HTMLElement | null;
  windSpeedElement: HTMLElement | null;
  humidityElement: HTMLElement | null;
  visibilityElement: HTMLElement | null;
  pressureElement: HTMLElement | null;
  sunriseElement: HTMLElement | null;
  sunsetElement: HTMLElement | null;
  weatherDescriptionElement: HTMLElement | null;
  airQualityElement: HTMLElement | null;
  uvIndexElement: HTMLElement | null;

  // Forecast container
  forecastContainer: HTMLElement | null;
}

// -----------------------------
// Get DOM Elements
// -----------------------------
export function getDOMElements(): DOMElements {
  return {
    cityInput: document.getElementById("city-input") as HTMLInputElement | null,
    searchButton: document.getElementById("search-button") as HTMLButtonElement | null,
    errorMessageElement: document.getElementById("error-message"),
    loaderWrapper: document.getElementById("loader-wrapper"),
    videoElement: document.querySelector(".video-background video") as HTMLVideoElement | null,
    videoSourceElement: document.querySelector(".video-background video source") as HTMLSourceElement | null,

    // Current Weather elements
    cityNameElement: document.querySelector(".currentCity"),
    temperatureElement: document.querySelector(".cityDegree"),
    feelsLikeElement: document.querySelector(".feelsLike"),
    windSpeedElement: document.querySelector(".windSpeed"),
    humidityElement: document.querySelector(".humidity"),
    visibilityElement: document.querySelector(".visibility"),
    pressureElement: document.querySelector(".pressure"),
    sunriseElement: document.querySelector(".sunriseTime"),
    sunsetElement: document.querySelector(".sunsetTime"),
    weatherDescriptionElement: document.querySelector(".weatherDescription"),
    airQualityElement: document.querySelector(".airQuality"),
    uvIndexElement: document.querySelector(".uvIndex"),

    // Forecast container
    forecastContainer: document.querySelector(".week-weather"),
  };
}
