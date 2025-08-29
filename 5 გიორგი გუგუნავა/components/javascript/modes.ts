// utils/darkmode.ts
import { updateBackground } from "./backgrounds";

// Grab DOM elements
const CHANGE_BUTTON = document.getElementById(
  "handle_cont"
) as HTMLElement | null;
const WEATHER_INFO = document.getElementById(
  "weather_info"
) as HTMLElement | null;

/**
 * Handles page theme modes (light/dark) with persistence in localStorage.
 */
const pageModes = (): void => {
  const enableDarkMode = (): void => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
  };

  const disableDarkMode = (): void => {
    document.body.classList.remove("darkmode");
    // Better to remove instead of storing null
    localStorage.removeItem("darkmode");
  };

  // Apply dark mode on load if stored
  if (localStorage.getItem("darkmode") === "active") {
    enableDarkMode();
  }

  // Update background based on current weather condition
  const updateBg = (): void => {
    if (WEATHER_INFO && WEATHER_INFO.textContent) {
      updateBackground(WEATHER_INFO.textContent);
    }
  };

  // Handle toggle button
  if (CHANGE_BUTTON) {
    CHANGE_BUTTON.addEventListener("click", () => {
      const currentMode = localStorage.getItem("darkmode");
      currentMode !== "active" ? enableDarkMode() : disableDarkMode();
      updateBg();
    });
  }
};

pageModes();

export { pageModes };
