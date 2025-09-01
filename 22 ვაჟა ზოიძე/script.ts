// main.ts

const API_KEY: string = "b2aa8f553e8e33b91429ba5c0931d905";

// DOM elements
const forecastContainer = document.getElementById(
  "forecast-container"
) as HTMLElement | null;
const form = document.getElementById("search-form") as HTMLFormElement | null;
const cityInput = document.getElementById(
  "city-input"
) as HTMLInputElement | null;
const titleElement = document.getElementById("title") as HTMLElement | null;

const defaultCity: string = "Batumi";
const daysOfForecast: number = 5;

// OpenWeather response types
interface WeatherData {
  list: ForecastItem[];
  city: {
    name: string;
  };
}

interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

/**
 * Updates the title with the selected city name
 */
function updateTitle(cityName: string): void {
  if (titleElement) {
    titleElement.textContent = `Weather Forecast - ${cityName}`;
  }
}

/**
 * Fetches and renders the weather forecast for a city
 */
async function getWeatherForecast(city: string): Promise<void> {
  if (!forecastContainer) return;
  forecastContainer.innerHTML = "Loading...";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error("City not found");

    const data: WeatherData = await response.json();
    const cityName: string = data.city.name;

    // Update title with city name
    updateTitle(cityName);

    const forecastList: ForecastItem[] = data.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, daysOfForecast); // Next 5 days at noon

    forecastContainer.innerHTML = "";

    forecastList.forEach((day: ForecastItem) => {
      const date: Date = new Date(day.dt_txt);
      const temp: number = Math.round(day.main.temp);
      const desc: string = day.weather[0]!.description;
      const icon: string = day.weather[0]!.icon;

      const card: HTMLDivElement = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <h3>${date.toDateString().slice(0, 10)}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" />
        <p>${temp}°C</p>
        <p>${desc}</p>
      `;

      forecastContainer.appendChild(card);
    });
  } catch (err: unknown) {
    if (forecastContainer) {
      const message = err instanceof Error ? err.message : "An error occurred";
      forecastContainer.innerHTML = `<p style="color:red;">${message}</p>`;
    }
    if (titleElement) {
      titleElement.textContent = "Weather Forecast";
    }
  }
}

/**
 * Handle search form submission
 */
if (form && cityInput) {
  form.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    const city: string = cityInput.value.trim();
    if (city) {
      getWeatherForecast(city);
    }
  });
}

// Load Batumi forecast by default
getWeatherForecast(defaultCity);
