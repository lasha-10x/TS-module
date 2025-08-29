// API key and URL
const apiKey: string = "b5fa2376151c16f558ca8b9d4557ee87";
const apiUrl: string =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// Select elements
const searchBox = document.querySelector(
  ".search input"
) as HTMLInputElement | null;
const searchBtn = document.querySelector(
  ".search button"
) as HTMLButtonElement | null;
const weatherIcon = document.querySelector(
  ".weather-icon"
) as HTMLImageElement | null;
const errorDiv = document.querySelector(".error") as HTMLDivElement | null;
const weatherDiv = document.querySelector(".weather") as HTMLDivElement | null;
const cityDiv = document.querySelector(".city") as HTMLDivElement | null;
const tempDiv = document.querySelector(".temp") as HTMLDivElement | null;
const humidityDiv = document.querySelector(
  ".humidity"
) as HTMLDivElement | null;
const windDiv = document.querySelector(".wind") as HTMLDivElement | null;

// Get weather data
async function checkWeather(city: string): Promise<void> {
  try {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);

    if (!response.ok) {
      if (response.status === 404) {
        if (errorDiv) errorDiv.style.display = "block";
        if (weatherDiv) weatherDiv.style.display = "none";
      }
      throw new Error(`City not found: ${city}`);
    }

    const data = await response.json();

    // Update weather info
    if (cityDiv) cityDiv.textContent = data.name;
    if (tempDiv) tempDiv.textContent = `${Math.round(data.main.temp)} °C`;
    if (humidityDiv) humidityDiv.textContent = `${data.main.humidity} %`;
    if (windDiv) windDiv.textContent = `${data.wind.speed} km/h`;

    // Change weather icon
    if (weatherIcon) {
      const weatherMain = data.weather[0].main;
      switch (weatherMain) {
        case "Clouds":
          weatherIcon.src = "images/clouds.png";
          break;
        case "Clear":
          weatherIcon.src = "images/clear.png";
          break;
        case "Rain":
          weatherIcon.src = "images/rain.png";
          break;
        case "Drizzle":
          weatherIcon.src = "images/drizzle.png";
          break;
        case "Mist":
          weatherIcon.src = "images/mist.png";
          break;
        default:
          weatherIcon.src = "images/clear.png";
      }
    }

    if (weatherDiv) weatherDiv.style.display = "block";
    if (errorDiv) errorDiv.style.display = "none";
  } catch (error: any) {
    console.error("Error fetching weather:", error.message);
    if (errorDiv) errorDiv.style.display = "block";
    if (weatherDiv) weatherDiv.style.display = "none";
  }
}

// Add event listener
if (searchBtn && searchBox) {
  searchBtn.addEventListener("click", () => {
    const city = searchBox.value.trim();
    if (city) {
      checkWeather(city);
    }
  });
}
