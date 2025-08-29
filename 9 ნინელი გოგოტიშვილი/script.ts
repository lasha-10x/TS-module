// -----------------------------
// Types
// -----------------------------
interface Weather {
  id: number;
  main: string;
}

interface MainWeather {
  temp: number;
  humidity: number;
}

interface Wind {
  speed: number;
}

interface Coord {
  lat: number;
  lon: number;
}

interface WeatherData {
  cod: number | string;
  name: string;
  main: MainWeather;
  weather: Weather[];
  wind: Wind;
  coord: Coord;
}

interface ForecastItem {
  dt_txt: string;
  main: { temp: number };
  weather: Weather[];
}

// -----------------------------
// DOM Elements
// -----------------------------
const mainContainer = document.querySelector<HTMLElement>("#main-container")!;
const cityInput = document.querySelector<HTMLInputElement>(".city-input")!;
const searchBtn = document.querySelector<HTMLButtonElement>(".search-btn")!;
const notFoundSection = document.querySelector<HTMLElement>(".not-found")!;
const searchCitySection = document.querySelector<HTMLElement>(".search-city")!;
const weatherInfoSection =
  document.querySelector<HTMLElement>(".weather-info")!;
const countryTxt = document.querySelector<HTMLElement>(".country-txt")!;
const tempTxt = document.querySelector<HTMLElement>(".temp-txt")!;
const conditionTxt = document.querySelector<HTMLElement>(".condition-txt")!;
const humidityValueTxt = document.querySelector<HTMLElement>(
  ".humidity-value-txt"
)!;
const windValueTxt = document.querySelector<HTMLElement>(".wind-value-txt")!;
const weatherSummaryImg = document.querySelector<HTMLImageElement>(
  ".weather-summary-img"
)!;
const currentDateTxt =
  document.querySelector<HTMLElement>(".current-date-txt")!;
const forecastItemsContainer = document.querySelector<HTMLElement>(
  ".forecast-items-container"
)!;
const favBtn = document.querySelector<HTMLButtonElement>("#fav-btn")!;
const cityNameEl = document.querySelector<HTMLElement>("#city-name")!;
const citySelEl = document.querySelector<HTMLElement>("#citySelection")!;
const preloaderEl = document.querySelector<HTMLElement>(".preloader")!;
const unitToggleBtn =
  document.querySelector<HTMLButtonElement>("#unit-toggle")!;
const sectionsContainer = document.querySelector<HTMLElement>(
  "#sections-container"
)!;
const googleMapLinkEl =
  document.querySelector<HTMLAnchorElement>(".google-map-link")!;
const themeTogglerEl =
  document.querySelector<HTMLInputElement>("#theme-switcher")!;

// -----------------------------
// API Key
// -----------------------------
const apiKey = "4839457010f81ec76815df2b63a09a87";

// -----------------------------
// Init
// -----------------------------
init();

// -----------------------------
// Functions
// -----------------------------
async function init() {
  const city = getLastViewedCity();
  if (city) {
    await updateWeatherInfo(city);
    const cityName = getCityName();
    if (cityName) {
      favBtn.textContent = cityExists(cityName) ? "stars" : "star";
      favBtn.classList.remove("hidden");
    }
  }
  initEventListeners();
}

function getLastViewedCity(): string | null {
  const city = localStorage.getItem("lastViewedCity");
  if (city) return city;

  const cities = getCityListFromLocalStorage();
  return cities.length ? cities[cities.length - 1] : null;
}

function initEventListeners() {
  favBtn.addEventListener("click", toggleFavorite);
  searchBtn.addEventListener("click", handleSearch);
  cityInput.addEventListener("keydown", handleEnterSearch);
  unitToggleBtn.addEventListener("click", handleUnitToggle);
  sectionsContainer.addEventListener("click", hideCityDropdown);
  themeTogglerEl.addEventListener("click", handleThemeToggle);
  cityInput.addEventListener("focus", () =>
    showCityDropdown(getCityListFromLocalStorage(), updateWeatherInfo)
  );
}

function toggleFavorite() {
  const cityName = getCityName();
  if (!cityName) return;

  let cities = getCityListFromLocalStorage();
  const cityLower = cityName.toLowerCase();

  if (cities.includes(cityLower)) {
    cities = cities.filter((c) => c !== cityLower);
    favBtn.textContent = "star";
  } else {
    cities.push(cityLower);
    favBtn.textContent = "stars";
  }

  if (!cities.length) localStorage.removeItem("cities");
  else localStorage.setItem("cities", JSON.stringify(cities));
}

function handleSearch() {
  const city = cityInput.value.trim();
  if (city) {
    updateWeatherInfo(city);
    cityInput.value = "";
    cityInput.blur();
    citySelEl.innerHTML = "";
  }
}

function handleEnterSearch(event: KeyboardEvent) {
  if (event.key === "Enter" && cityInput.value.trim() !== "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
}

function handleUnitToggle() {
  const currentScale = getTemperatureScaleUnit();
  const newScale = currentScale === "C" ? "F" : "C";
  setTemperatureScaleUnit(newScale);
  updateUnitToggleButton(newScale);

  const city = getCityName();
  if (city) updateWeatherInfo(city);
}

function handleThemeToggle(evt: Event) {
  const target = evt.currentTarget as HTMLInputElement;
  if (target.checked) {
    document.documentElement.style.setProperty("--main-bg", "var(--bg-light)");
    document.documentElement.style.setProperty(
      "--main-color",
      "var(--text-light)"
    );
    document.documentElement.style.setProperty(
      "--main-bg-rgb",
      "var(--bg-light-rgb)"
    );
    document.documentElement.style.setProperty(
      "--main-color-rgb",
      "var(--text-light-rgb)"
    );
  } else {
    document.documentElement.style.setProperty("--main-bg", "var(--bg-dark)");
    document.documentElement.style.setProperty(
      "--main-color",
      "var(--text-dark)"
    );
    document.documentElement.style.setProperty(
      "--main-bg-rgb",
      "var(--bg-dark-rgb)"
    );
    document.documentElement.style.setProperty(
      "--main-color-rgb",
      "var(--text-dark-rgb)"
    );
  }
}

function getCityName(): string {
  return cityNameEl.textContent?.trim() ?? "";
}

function getCityListFromLocalStorage(): string[] {
  const data = localStorage.getItem("cities");
  return data ? JSON.parse(data) : [];
}

function cityExists(city: string): boolean {
  const cities = getCityListFromLocalStorage();
  return cities.includes(city.toLowerCase());
}

function setTemperatureScaleUnit(unit: string) {
  localStorage.setItem("temperatureScaleUnit", unit);
}

function getTemperatureScaleUnit(): "C" | "F" {
  return (localStorage.getItem("temperatureScaleUnit") as "C" | "F") || "C";
}

function updateUnitToggleButton(currentScale: "C" | "F") {
  unitToggleBtn.textContent =
    currentScale === "C" ? "Switch to °F" : "Switch to °C";
}

function showCityDropdown(
  cities: string[],
  onSelectCity: (city: string) => void
) {
  citySelEl.innerHTML = "";
  const ul = document.createElement("ul");
  cities.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.classList.add("city-sel-item");
    li.addEventListener("click", () => {
      onSelectCity(city);
      hideCityDropdown();
    });
    ul.appendChild(li);
  });
  citySelEl.appendChild(ul);
}

function hideCityDropdown() {
  citySelEl.innerHTML = "";
}

async function getFetchData(endPoint: string, city: string): Promise<any> {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

function getWeatherIcon(id: number): string {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id === 800) return "clear.svg";
  return "clouds.svg";
}

function getCurrentDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function celsius2fahrenheit(celsius: number): number {
  if (isNaN(celsius)) return NaN;
  return Math.round((celsius * 9) / 5 + 32);
}

function togglePreloader(show: boolean) {
  preloaderEl.style.display = show ? "flex" : "none";
}

function showDisplaySection(section: HTMLElement) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (s) => (s.style.display = "none")
  );
  section.style.display = "flex";
}

async function updateWeatherInfo(city: string) {
  togglePreloader(true);

  const weatherData: WeatherData = await getFetchData("weather", city);
  if (Number(weatherData.cod) !== 200) {
    showDisplaySection(notFoundSection);
    togglePreloader(false);
    return;
  }

  localStorage.setItem("lastViewedCity", city);

  const {
    name: country,
    main: { temp, humidity },
    weather,
    wind: { speed },
    coord: { lat, lon },
  } = weatherData;

  const weatherItem = weather[0] ?? { id: 800, main: "" };

  const scaleUnit = getTemperatureScaleUnit();
  const displayTemp =
    scaleUnit === "C"
      ? Math.round(temp) + " °C"
      : celsius2fahrenheit(temp) + " °F";

  googleMapLinkEl.href = `https://www.google.com/maps?q=${lat},${lon}`;
  googleMapLinkEl.target = "_blank";

  countryTxt.textContent = country;
  tempTxt.textContent = displayTemp;
  conditionTxt.textContent = weatherItem.main;
  humidityValueTxt.textContent = humidity + " %";
  windValueTxt.textContent = speed + " M/s";
  weatherSummaryImg.src = `assets/weather/${getWeatherIcon(weatherItem.id)}`;
  currentDateTxt.textContent = getCurrentDate();
  cityNameEl.textContent = country;

  updateBackground(weatherItem.id, temp);

  await updateForecastsInfo(city);

  togglePreloader(false);
  showDisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city: string) {
  const forecastsData = await getFetchData("forecast", city);

  forecastItemsContainer.innerHTML = "";

  const todayDate: string = new Date().toISOString().split("T")[0];

  const dailyForecasts: Record<string, ForecastItem[]> = {};

  forecastsData.list.forEach((item: ForecastItem) => {
    if (!item.dt_txt) return;
    const itemDate: string = item.dt_txt.split(" ")[0];

    if (itemDate !== todayDate) {
      if (!dailyForecasts[itemDate]) dailyForecasts[itemDate] = [];
      dailyForecasts[itemDate].push(item);
    }
  });

  Object.keys(dailyForecasts).forEach((date) => {
    const dayData = dailyForecasts[date];
    if (!dayData) return;

    let minTemp = Infinity;
    let maxTemp = -Infinity;
    let forecast: ForecastItem | null = null;

    dayData.forEach((entry) => {
      const temp = entry.main.temp;
      if (temp < minTemp) minTemp = temp;
      if (temp > maxTemp) maxTemp = temp;
      forecast = entry;
    });

    if (forecast) updateForecastItem(forecast, minTemp, maxTemp);
  });
}

function updateForecastItem(
  forecast: ForecastItem,
  minTemp: number,
  maxTemp: number
) {
  const { dt_txt: date, weather } = forecast;
  const weatherItem = weather[0] ?? { id: 800, main: "" };

  const dateResult = new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

  const scaleUnit = getTemperatureScaleUnit();
  let minMaxTemp: string =
    scaleUnit === "C"
      ? Math.round(minTemp).toString()
      : celsius2fahrenheit(minTemp).toString();

  if (maxTemp > minTemp) {
    const maxResolved =
      scaleUnit === "C" ? Math.round(maxTemp) : celsius2fahrenheit(maxTemp);
    minMaxTemp += ` - ${maxResolved}`;
  }

  minMaxTemp += scaleUnit === "C" ? " °C" : " °F";

  const forecastItemHTML = `
    <div class="forecast-item">
      <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
      <img src="assets/weather/${getWeatherIcon(
        weatherItem.id
      )}" class="firecast-item-img">
      <h5 class="forecast-item-temp">${minMaxTemp}</h5>
    </div>
  `;

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItemHTML);
}

function updateBackground(id: number, temp: number) {
  const container = document.body;
  let gradient = "";

  if (id >= 200 && id < 300)
    gradient = "linear-gradient(to top, #3a3a3a, #000000)";
  else if (id >= 300 && id < 600)
    gradient = "linear-gradient(to top, #4e54c8, #8f94fb)";
  else if (id >= 600 && id < 700)
    gradient = "linear-gradient(to top, #83a4d4, #b6fbff)";
  else if (id >= 700 && id < 800)
    gradient = "linear-gradient(to top, #bdc3c7, #2c3e50)";
  else if (id === 800) gradient = "linear-gradient(to top, #f7971e, #ffd200)";
  else if (id > 800) gradient = "linear-gradient(to top, #757f9a, #d7dde8)";

  if (temp <= 0) gradient = "linear-gradient(to top, #83a4d4, #b6fbff)";
  else if (temp >= 30) gradient = "linear-gradient(to top, #ff512f, #f09819)";

  container.style.background = gradient;
}
