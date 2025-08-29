// Define constants for background styles (replace with actual CSS values or URLs)
const MOON_NIGHT = 'url("/images/moon_night.jpg") no-repeat center/cover';
const CLOUDY_NIGHT = 'url("/images/cloudy_night.jpg") no-repeat center/cover';
const RAINY_NIGHT = 'url("/images/rainy_night.jpg") no-repeat center/cover';
const SNOWY_NIGHT = 'url("/images/snowy_night.jpg") no-repeat center/cover';

const SUNNY_DAY = 'url("/images/sunny_day.jpg") no-repeat center/cover';
const CLOUDY_DAY = 'url("/images/cloudy_day.jpg") no-repeat center/cover';
const RAINY_DAY = 'url("/images/rainy_day.jpg") no-repeat center/cover';
const SNOWY_DAY = 'url("/images/snowy_day.jpg") no-repeat center/cover';

// Type for weather conditions
type WeatherCondition = "clear" | "clouds" | "rain" | "snow" | string;

/**
 * Updates the background of the document body based on weather and mode.
 * @param weatherCondition - The current weather condition (e.g., "clear", "rain").
 */
export const updateBackground = (weatherCondition: WeatherCondition): void => {
  const body = document.body;
  if (!body) return; // Ensure body exists

  const isDarkMode = body.classList.contains("darkmode");
  const condition = weatherCondition.toLowerCase();

  if (isDarkMode) {
    switch (condition) {
      case "clear":
        body.style.background = MOON_NIGHT;
        break;
      case "clouds":
        body.style.background = CLOUDY_NIGHT;
        break;
      case "rain":
        body.style.background = RAINY_NIGHT;
        break;
      case "snow":
        body.style.background = SNOWY_NIGHT;
        break;
      default:
        body.style.background = MOON_NIGHT;
    }
  } else {
    switch (condition) {
      case "clear":
        body.style.background = SUNNY_DAY;
        break;
      case "clouds":
        body.style.background = CLOUDY_DAY;
        break;
      case "rain":
        body.style.background = RAINY_DAY;
        break;
      case "snow":
        body.style.background = SNOWY_DAY;
        break;
      default:
        body.style.background = SUNNY_DAY;
    }
  }
};
