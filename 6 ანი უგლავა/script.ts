const apiKey = "2cfefa8cc7d0a0497af648250697a29f";

// DOM Elements
const cityInput = document.getElementById("cityInput") as HTMLInputElement;
const cityEl = document.getElementById("city") as HTMLElement;
const tempEl = document.getElementById("temp") as HTMLElement;
const feelsEl = document.getElementById("feels") as HTMLElement;
const highEl = document.getElementById("high") as HTMLElement;
const lowEl = document.getElementById("low") as HTMLElement;
const humidityEl = document.querySelector(".humidity") as HTMLElement;
const windEl = document.querySelector(".wind") as HTMLElement;
const pressureEl = document.querySelector(".pressure") as HTMLElement;
const sunriseEl = document.querySelector(".sunrise") as HTMLElement;
const sunsetEl = document.querySelector(".sunset") as HTMLElement;

// Interfaces for API response
interface WeatherResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: { description: string; id: number }[];
  wind: { speed: number };
  sys: { sunrise: number; sunset: number };
}

// Listen for Enter key
cityInput.addEventListener("keydown", function (e: KeyboardEvent) {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
    } else {
      alert("Please enter a city name");
    }
  }
});

// Fetch weather data
async function getWeatherData(city: string): Promise<void> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");

    const data: WeatherResponse = await response.json();
    displayWeather(data);
  } catch (error: any) {
    alert("Error: " + error.message);
  }
}

// Display weather data
function displayWeather(data: WeatherResponse): void {
  cityEl.textContent = data.name;
  tempEl.innerHTML = `${Math.round(data.main.temp)}&#8451;`;
  feelsEl.innerHTML = `${Math.round(data.main.feels_like)}&#8451;`;
  highEl.innerHTML = `${Math.round(data.main.temp_max)}&#8451;`;
  lowEl.innerHTML = `${Math.round(data.main.temp_min)}&#8451;`;

  humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
  windEl.textContent = `Wind: ${data.wind.speed} m/s`;
  pressureEl.textContent = `Pressure: ${data.main.pressure} hPa`;

  sunriseEl.textContent = `Sunrise: ${new Date(
    data.sys.sunrise * 1000
  ).toLocaleTimeString()}`;
  sunsetEl.textContent = `Sunset: ${new Date(
    data.sys.sunset * 1000
  ).toLocaleTimeString()}`;

  // Optional: Weather description
  const weatherDescription = data.weather?.[0]?.description ?? "N/A";
  console.log("Weather description:", weatherDescription);
}
