"use strict";
// ---------------------- Constants ----------------------
const baseUrl = "https://api.weatherapi.com/v1/forecast.json";
const apiKey = "b3a215352e0d4d168fc100144252007";
const defaultCity = "Tbilisi";
const searchForm = document.querySelector(".search-section");
// ---------------------- Search ----------------------
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const target = e.target;
    const searchCity = target[0].value.trim();
    if (searchCity) {
      weatherForecast(baseUrl, apiKey, searchCity);
    }
  });
}
// ---------------------- Fetch Weather ----------------------
async function weatherForecast(base, key, city) {
  const url = `${base}?key=${key}&q=${city}&days=14`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    renderWeatherData(json);
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}
weatherForecast(baseUrl, apiKey, defaultCity);
// ---------------------- Render Functions ----------------------
function renderWeatherData(weatherObject) {
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
    forecast.forecastday[0].astro.sunset,
    forecast.forecastday[0].astro.sunrise
  );
}
// ---------------------- Helpers ----------------------
function renderCityName(city) {
  const cityTag = document.querySelector("#city-name");
  if (cityTag) cityTag.textContent = city;
}
function renderRegion(country) {
  const countryTag = document.querySelector("#country-name");
  if (countryTag) countryTag.textContent = country;
}
function renderLocalDate(date) {
  const timeTag = document.querySelector("#current-time");
  const dateTag = document.querySelector("#current-date");
  const [currentDate, currentTime] = date.split(" ");
  if (timeTag) timeTag.textContent = currentTime ?? "";
  if (dateTag) dateTag.textContent = currentDate ?? "";
}
function renderTemp(temp) {
  const tempTag = document.querySelector("#current-temp");
  if (tempTag) tempTag.textContent = `${temp} °C`;
}
function renderWeatherDescription(description) {
  const descriptionTag = document.querySelector("#weather-description");
  if (descriptionTag) descriptionTag.textContent = description;
}
function renderIcon(icon) {
  const iconTag = document.querySelector("#weather-icon");
  if (iconTag) iconTag.src = `https:${icon}`;
}
function renderFeelsLikeTemp(temp) {
  const feelsLikeTag = document.querySelector("#feels-like");
  if (feelsLikeTag) feelsLikeTag.textContent = `Feels Like: ${temp} °C`;
}
function renderSunsetSunrise(sunset, sunrise) {
  const sunsetTag = document.querySelector("#sunset-time");
  if (sunsetTag) sunsetTag.textContent = sunset;
  const sunriseTag = document.querySelector("#sunrise-time");
  if (sunriseTag) sunriseTag.textContent = sunrise;
}
function renderHumidity(humidity) {
  const humidityTag = document.querySelector("#humidity-value");
  if (humidityTag) humidityTag.textContent = `${humidity} %`;
}
function renderWind(wind) {
  const windTag = document.querySelector("#wind-degree");
  if (windTag) windTag.textContent = `${wind} °`;
}
function renderCloud(cloud) {
  const cloudTag = document.querySelector("#cloud-value");
  if (cloudTag) cloudTag.textContent = `${cloud} %`;
}
function renderUv(uv) {
  const uvTag = document.querySelector("#uv-index-value");
  if (uvTag) uvTag.textContent = uv.toString();
}
// ---------------------- Dark Mode ----------------------
const toggle = document.getElementById("darkmode-toggle");
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
//# sourceMappingURL=app.js.map
