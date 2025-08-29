// ---------------------- Types ----------------------
interface WeatherApiResponse {
  location: {
    name: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    humidity: number;
    wind_degree: number;
    cloud: number;
    uv: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  forecast: {
    forecastday: {
      astro: {
        sunset: string;
        sunrise: string;
      };
    }[];
  };
}

// ---------------------- Constants ----------------------
const baseUrl = "https://api.weatherapi.com/v1/forecast.json";
const apiKey = "b3a215352e0d4d168fc100144252007";
const defaultCity = "Tbilisi";

const searchForm = document.querySelector(
  ".search-section"
) as HTMLFormElement | null;

// ---------------------- Search ----------------------
if (searchForm) {
  searchForm.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const searchCity = (target[0] as HTMLInputElement).value.trim();
    if (searchCity) {
      weatherForecast(baseUrl, apiKey, searchCity);
    }
  });
}

// ---------------------- Fetch Weather ----------------------
async function weatherForecast(
  base: string,
  key: string,
  city: string
): Promise<void> {
  const url = `${base}?key=${key}&q=${city}&days=14`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json: WeatherApiResponse = await response.json();
    renderWeatherData(json);
    console.log(json);
  } catch (error) {
    console.error((error as Error).message);
  }
}

weatherForecast(baseUrl, apiKey, defaultCity);

// ---------------------- Render Functions ----------------------
function renderWeatherData(weatherObject: WeatherApiResponse): void {
  const { location, current, forecast } = weatherObject;
  const { name, localtime, country } = location;
  const { temp_c, condition, feelslike_c, humidity, wind_degree, cloud, uv } =
    current;

  renderRegion(country);
  renderCityName(name);
  renderLocalDate(localtime);
  renderTemp(temp_c);
  renderWeatherDescription(condition.text);
  renderIcon(condition.icon);
  renderFeelsLikeTemp(feelslike_c);
  renderHumidity(humidity);
  renderWind(wind_degree);
  renderCloud(cloud);
  renderUv(uv);
  renderSunsetSunrise(
    forecast.forecastday[0]!.astro.sunset,
    forecast.forecastday[0]!.astro.sunrise
  );
}

// ---------------------- Helpers ----------------------
function renderCityName(city: string): void {
  const cityTag = document.querySelector("#city-name") as HTMLElement | null;
  if (cityTag) cityTag.textContent = city;
}

function renderRegion(country: string): void {
  const countryTag = document.querySelector(
    "#country-name"
  ) as HTMLElement | null;
  if (countryTag) countryTag.textContent = country;
}

function renderLocalDate(date: string): void {
  const timeTag = document.querySelector("#current-time") as HTMLElement | null;
  const dateTag = document.querySelector("#current-date") as HTMLElement | null;

  const [currentDate, currentTime] = date.split(" ");

  if (timeTag) timeTag.textContent = currentTime ?? "";
  if (dateTag) dateTag.textContent = currentDate ?? "";
}

function renderTemp(temp: number): void {
  const tempTag = document.querySelector("#current-temp") as HTMLElement | null;
  if (tempTag) tempTag.textContent = `${temp} °C`;
}

function renderWeatherDescription(description: string): void {
  const descriptionTag = document.querySelector(
    "#weather-description"
  ) as HTMLElement | null;
  if (descriptionTag) descriptionTag.textContent = description;
}

function renderIcon(icon: string): void {
  const iconTag = document.querySelector(
    "#weather-icon"
  ) as HTMLImageElement | null;
  if (iconTag) iconTag.src = `https:${icon}`;
}

function renderFeelsLikeTemp(temp: number): void {
  const feelsLikeTag = document.querySelector(
    "#feels-like"
  ) as HTMLElement | null;
  if (feelsLikeTag) feelsLikeTag.textContent = `Feels Like: ${temp} °C`;
}

function renderSunsetSunrise(sunset: string, sunrise: string): void {
  const sunsetTag = document.querySelector(
    "#sunset-time"
  ) as HTMLElement | null;
  if (sunsetTag) sunsetTag.textContent = sunset;

  const sunriseTag = document.querySelector(
    "#sunrise-time"
  ) as HTMLElement | null;
  if (sunriseTag) sunriseTag.textContent = sunrise;
}

function renderHumidity(humidity: number): void {
  const humidityTag = document.querySelector(
    "#humidity-value"
  ) as HTMLElement | null;
  if (humidityTag) humidityTag.textContent = `${humidity} %`;
}

function renderWind(wind: number): void {
  const windTag = document.querySelector("#wind-degree") as HTMLElement | null;
  if (windTag) windTag.textContent = `${wind} °`;
}

function renderCloud(cloud: number): void {
  const cloudTag = document.querySelector("#cloud-value") as HTMLElement | null;
  if (cloudTag) cloudTag.textContent = `${cloud} %`;
}

function renderUv(uv: number): void {
  const uvTag = document.querySelector("#uv-index-value") as HTMLElement | null;
  if (uvTag) uvTag.textContent = uv.toString();
}

// ---------------------- Dark Mode ----------------------
const toggle = document.getElementById(
  "darkmode-toggle"
) as HTMLInputElement | null;

if (toggle) {
  // restore dark mode from localStorage
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    toggle.checked = true;
  }

  // toggle dark mode
  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
    }
  });
}
