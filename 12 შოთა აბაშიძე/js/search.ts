// weatherSearch.ts

const apiKey = "e96f98a7a2898c4e4f62aee037961831";

// -----------------------------
// Types
// -----------------------------
interface WeatherMain {
  temp: number;
  pressure: number;
  humidity: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
}

interface Wind {
  speed: number;
  deg: number;
}

interface Sys {
  sunrise: number;
  sunset: number;
  country: string;
}

interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

interface WeatherData {
  name: string;
  main: WeatherMain;
  wind: Wind;
  sys: Sys;
  weather: WeatherCondition[];
}

// -----------------------------
// Utility function to get DOM elements safely
// -----------------------------
function getElement<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Element with selector "${selector}" not found`);
  return el as T;
}

// -----------------------------
// Get Weather Image based on condition
// -----------------------------
function getWeatherImage(condition: string): string {
  const key = condition.toLowerCase();
  switch (key) {
    case "rain":
      return "img/rain.png";
    case "clear":
      return "img/sun.png";
    case "snow":
      return "img/snow.png";
    case "clouds":
    case "smoke":
      return "img/cloud.png";
    case "mist":
    case "fog":
      return "img/mist.png";
    case "haze":
      return "img/haze.png";
    case "thunderstorm":
      return "img/thunderstorm.png";
    default:
      return "img/sun.png";
  }
}

// -----------------------------
// Search Weather Function
// -----------------------------
async function search(
  city: string,
  state?: string,
  country?: string
): Promise<void> {
  try {
    const query = [city, state, country].filter(Boolean).join(",");
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${query}&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("City not found or API error");
    }

    const data: WeatherData = await response.json();
    console.log(data);

    // Show results
    const box = getElement<HTMLDivElement>(".return");
    box.style.display = "block";

    getElement<HTMLDivElement>(".message").style.display = "none";
    getElement<HTMLDivElement>(".error-message").style.display = "none";

    const weatherImg = getElement<HTMLImageElement>(".weather-img");

    getElement<HTMLDivElement>(".city-name").innerText = data.name;
    getElement<HTMLDivElement>(".weather-temp").innerText = `${Math.floor(
      data.main.temp
    )}°`;
    getElement<HTMLDivElement>(".wind").innerText = `${Math.floor(
      data.wind.speed
    )} m/s`;
    getElement<HTMLDivElement>(".pressure").innerText = `${Math.floor(
      data.main.pressure
    )} hPa`;
    getElement<HTMLDivElement>(".humidity").innerText = `${Math.floor(
      data.main.humidity
    )}%`;
    getElement<HTMLDivElement>(".sunrise").innerText = new Date(
      data.sys.sunrise * 1000
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    getElement<HTMLDivElement>(".sunset").innerText = new Date(
      data.sys.sunset * 1000
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    weatherImg.src = getWeatherImage(data.weather[0]!.main);
  } catch (error) {
    console.error(error);

    getElement<HTMLDivElement>(".return").style.display = "none";
    getElement<HTMLDivElement>(".message").style.display = "none";
    getElement<HTMLDivElement>(".error-message").style.display = "block";
  }
}

// -----------------------------
// Event Listener for Search Input
// -----------------------------
const searchInput = getElement<HTMLInputElement>(".searchinput");

searchInput.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    search(searchInput.value);
    console.log("Search triggered");
  }
});
