// utils/temperatureMode.ts
// This file handles the temperature unit conversion feature, allowing users to switch between Celsius and Fahrenheit.

const CHANGE_TEMPERATURE = document.getElementById("temp_handle_cont") as HTMLElement | null;

// Track if current mode is Fahrenheit
let isFahrenheit: boolean = localStorage.getItem("temperature") === "fahrenheit";

/**
 * Toggles between Celsius and Fahrenheit display modes.
 * @param currentWeatherData - Weather data object used to re-render UI
 */
const temperatureMode = (currentWeatherData: any): void => {
  const enableFahrenheit = (): void => {
    document.body.classList.add("fahrenheit");
    localStorage.setItem("temperature", "fahrenheit");
    isFahrenheit = true;
  };

  const disableFahrenheit = (): void => {
    document.body.classList.remove("fahrenheit");
    localStorage.setItem("temperature", "celsius");
    isFahrenheit = false;
  };

  // Initialize UI based on stored preference
  if (isFahrenheit) {
    enableFahrenheit();
  } else {
    disableFahrenheit();
  }

  // Handle button click for switching units
  if (CHANGE_TEMPERATURE) {
    CHANGE_TEMPERATURE.addEventListener("click", () => {
      const currentMode = localStorage.getItem("temperature");
      currentMode !== "fahrenheit" ? enableFahrenheit() : disableFahrenheit();

      // Re-render weather data after unit change
      if (currentWeatherData) {
        renderTodayWeather(currentWeatherData);
        renderForcast(currentWeatherData);
      }
    });
  }
};

// Declare global functions (coming from elsewhere in the app)
declare global {
  interface Window {
    renderTodayWeather: (data: any) => void;
    renderForcast: (data: any) => void;
  }
}

// Assume these functions are globally available
const renderTodayWeather = window.renderTodayWeather;
const renderForcast = window.renderForcast;

export { temperatureMode, isFahrenheit };
