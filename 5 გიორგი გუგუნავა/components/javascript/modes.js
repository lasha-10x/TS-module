// utils/darkmode.ts
import { updateBackground } from "./backgrounds.js";
// Grab DOM elements
const CHANGE_BUTTON = document.getElementById("handle_cont");
const WEATHER_INFO = document.getElementById("weather_info");
/**
 * Handles page theme modes (light/dark) with persistence in localStorage.
 */
const pageModes = () => {
  const enableDarkMode = () => {
    document.body.classList.add("darkmode");
    localStorage.setItem("darkmode", "active");
  };
  const disableDarkMode = () => {
    document.body.classList.remove("darkmode");
    // Better to remove instead of storing null
    localStorage.removeItem("darkmode");
  };
  // Apply dark mode on load if stored
  if (localStorage.getItem("darkmode") === "active") {
    enableDarkMode();
  }
  // Update background based on current weather condition
  const updateBg = () => {
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
//# sourceMappingURL=modes.js.map
