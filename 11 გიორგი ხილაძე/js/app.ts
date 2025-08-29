import { DEFAULT_CITY } from "./config";
import { getDOMElements } from "./domElements";
import {
  showLoader,
  hideLoader,
  displayErrorMessage,
  initUIElements,
} from "./ui";
import { getCurrentWeather, getFiveDayForecast } from "./api";
import { processForecastData } from "./dataUtils";
import {
  displayCurrentWeather,
  displayFiveDayForecast,
  updateBackgroundVideo,
  initRenderersElements,
} from "./renderers";
import { CurrentWeatherResponse, ForecastData } from "./types";

document.addEventListener("DOMContentLoaded", async () => {
  initUIElements();
  initRenderersElements();
  const { cityInput, searchButton } = getDOMElements();

  async function loadWeather(city: string) {
    displayErrorMessage("");
    showLoader();

    try {
      const weather: CurrentWeatherResponse | null = await getCurrentWeather(
        city
      );
      if (weather?.weather?.length)
        updateBackgroundVideo(weather.weather[0]!.main);

      if (weather) displayCurrentWeather(weather);
      else displayErrorMessage("City not found");

      const forecast: ForecastData | null = await getFiveDayForecast(city);
      if (forecast) {
        const processed = processForecastData(forecast);
        displayFiveDayForecast(
          processed,
          weather?.sys?.sunrise,
          weather?.sys?.sunset
        );
      } else {
        displayErrorMessage("Could not get forecast");
      }
    } catch (err) {
      console.error(err);
      displayErrorMessage("Failed to load weather data");
    } finally {
      hideLoader();
    }
  }

  searchButton?.addEventListener("click", () => {
    if (!cityInput) return;
    const city = cityInput.value.trim();
    if (city) loadWeather(city);
  });

  cityInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchButton?.click();
  });

  await loadWeather(DEFAULT_CITY);
});
