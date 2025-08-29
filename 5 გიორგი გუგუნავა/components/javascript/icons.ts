// utils/weatherIcons.ts

/**
 * Updates the weather icon for the given target element.
 * @param iconPath - Path to the weather icon (SVG)
 * @param targetElement - HTML <img> element where the icon will be displayed
 */
const updateWeatherIcon = (
  iconPath: string,
  targetElement: HTMLImageElement | null
): void => {
  if (targetElement) {
    targetElement.src = iconPath;
  }
};

/**
 * Gets the weather icon path based on the weather condition.
 * @param weatherCondition - Weather condition (e.g., "clear", "clouds", "rain", "snow")
 * @returns The path to the corresponding icon, or a default icon if not found
 */
const getWeatherIcon = (weatherCondition: string): string => {
  const condition = weatherCondition.toLowerCase();

  const iconMap: Record<string, string> = {
    clear: "./assets/icon/weather-icons-master/svg/wi-day-sunny.svg",
    clouds: "./assets/icon/weather-icons-master/svg/wi-cloudy.svg",
    rain: "./assets/icon/weather-icons-master/svg/wi-rain.svg",
    snow: "./assets/icon/weather-icons-master/svg/wi-snow.svg",
  };

  // Return the matched icon, or a default one if condition not found
  return (
    iconMap[condition] || "./assets/icon/weather-icons-master/svg/wi-na.svg"
  );
};

// Example usage:
const imgElement = document.querySelector(
  "img.weather-icon"
) as HTMLImageElement | null;
const iconPath = getWeatherIcon("Clear");
updateWeatherIcon(iconPath, imgElement);
