// utils/loader.ts

// Query elements
const loader = document.getElementsByClassName(
  "sk-cube-grid"
) as HTMLCollectionOf<HTMLElement>;
const WEATHER_CONTENT = document.getElementsByClassName(
  "city_container"
) as HTMLCollectionOf<HTMLElement>;

/**
 * Displays the loader and hides the weather content.
 */
const showLoader = (): void => {
  if (loader.length > 0) loader[0]!.style.display = "block";
  if (WEATHER_CONTENT.length > 0) WEATHER_CONTENT[0]!.style.display = "none";
};

/**
 * Hides the loader and displays the weather content.
 */
const hideLoader = (): void => {
  if (loader.length > 0) loader[0]!.style.display = "none";
  if (WEATHER_CONTENT.length > 0) WEATHER_CONTENT[0]!.style.display = "flex";
};

// Extend the Window interface to add custom properties (marked optional to avoid conflicts)
declare global {
  interface Window {
    showLoader?: () => void;
    hideLoader?: () => void;
  }
}

// Attach functions to window object
window.showLoader = showLoader;
window.hideLoader = hideLoader;

export { showLoader, hideLoader };
