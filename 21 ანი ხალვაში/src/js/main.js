import { weatherContentConfig, getWeeklyWeatherData } from "./utils.js";
// Grab DOM elements
const WELCOME_BOX = document.getElementById("welcome");
const SEARCH_INPUT = document.getElementById("search-input");
const SEARCH_BUTTON = document.getElementById("search-button");
const TRY_BUTTON = document.getElementById("try-button");
const SEARCH_ENGINE = document.getElementById("search-engine");
const HELPER_TEXT = document.getElementById("helper-text");
const PLACE = document.getElementById("place");
const WEATHER_VALUE = document.getElementById("weather-value");
const WEATHER_STATUS = document.getElementById("weather-status");
const WIND_SPEED = document.getElementById("wind-speed");
const HUMIDITY = document.getElementById("humidity");
const FAVORITE_BOX = document.getElementById("favorite-box");
const FAVORITE_BUTTON = document.getElementById("favorite-button");
const FAVORITES_CONTAINER = document.getElementById("favorites");
const FAVORITE_STAR = document.getElementById("favorite-star");
const WEEKLY_CONTAINER = document.getElementById("weekly-weather");
const BODY = document.querySelector("body");
const QUOTE = document.getElementById("quote");
const CHARACTER_IMAGE = document.getElementById("character-image");
const WEATHER_CONTENT = document.getElementById("weather-content");
// Constants
const EMOJIES = ["🌆", "🗼", "🏖️", "🎨", "🌉", "🕌", "🍷", "🍜", "🎡", "🚲"];
let FAVORITE_PLACES = JSON.parse(
  localStorage.getItem("favorite-places") ?? "[]"
);
let CURRENT_PLACE = localStorage.getItem("current-place") ?? "";
// --- UTILITY FUNCTIONS ---
const clearErrorState = () => {
  SEARCH_ENGINE.style.border = "none";
  HELPER_TEXT.textContent = "";
};
const renderErrorState = (message) => {
  SEARCH_ENGINE.style.border = "1px solid red";
  HELPER_TEXT.textContent = message;
};
const renderContent = (weatherData) => {
  WEATHER_CONTENT.style.display = "flex";
  FAVORITE_BOX.style.display = "block";
  FAVORITES_CONTAINER.style.display = "flex";
  WELCOME_BOX.style.display = "none";
  const place = weatherData.name;
  const weatherInfo = weatherData.weather[0];
  const weatherKey =
    weatherInfo.main in weatherContentConfig ? weatherInfo.main : "Clear";
  const weatherObject = weatherContentConfig[weatherKey];
  CHARACTER_IMAGE.src = `../../assets/images/${
    weatherObject.character ?? "default-character.jpg"
  }`;
  PLACE.textContent = place;
  localStorage.setItem("current-place", place);
  const tempCelsius = weatherData.main.temp - 273.15;
  WEATHER_VALUE.textContent = `${tempCelsius.toFixed(0)}°C`;
  WEATHER_STATUS.textContent = weatherInfo.main;
  WIND_SPEED.textContent = weatherData.wind.speed;
  HUMIDITY.textContent = weatherData.main.humidity;
  BODY.style.background = weatherObject.backgroundColor;
  QUOTE.textContent = `"${weatherObject.quote}"`;
};
// --- FAVORITES ---
const renderFavorites = () => {
  FAVORITES_CONTAINER.innerHTML = "";
  FAVORITE_PLACES.forEach((favoritePlace) => {
    const randomEmoji = EMOJIES[Math.floor(Math.random() * EMOJIES.length)];
    const favoriteContainer = document.createElement("div");
    favoriteContainer.className = "favorite-city";
    favoriteContainer.addEventListener("click", () => {
      getWeatherData(favoritePlace);
    });
    favoriteContainer.innerHTML = `<p>${randomEmoji}</p><p>${favoritePlace}</p><img src="../assets/icons/location.png" alt="" />`;
    FAVORITES_CONTAINER.appendChild(favoriteContainer);
  });
};
renderFavorites();
// --- FETCH WEATHER ---
const getWeatherData = async (place) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=9b1eafa8504d3df1a475ec2a4e57743f`;
  const res = await fetch(apiUrl);
  const weatherData = await res.json();
  if (weatherData.name) {
    clearErrorState();
    SEARCH_INPUT.value = "";
    renderContent(weatherData);
    CURRENT_PLACE = place;
  } else {
    renderErrorState(weatherData.message);
  }
  renderWeeklyWeather();
};
// --- RENDER WEEKLY WEATHER ---
const renderWeeklyWeather = async () => {
  if (!CURRENT_PLACE) return;
  const weeklyWeather = await getWeeklyWeatherData(CURRENT_PLACE);
  WEEKLY_CONTAINER.innerHTML = "";
  weeklyWeather.forEach((item) => {
    const weatherKey =
      item.weather[0].main in weatherContentConfig
        ? item.weather[0].main
        : "Clear";
    const weatherConfig = weatherContentConfig[weatherKey];
    const weeklyCard = document.createElement("div");
    weeklyCard.className = "weekly-card";
    const currentTemp = item.main.temp - 273.15;
    const date = new Date(item.dt_txt);
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "2-digit",
    });
    weeklyCard.innerHTML = `
      <h4>${formatter.format(date)}</h4>
      <p class="emojy">${weatherConfig.icon}</p>
      <p class="celsius">${currentTemp.toFixed(0)}°C</p>
      <p class="weather-type">${item.weather[0].main}</p>
    `;
    WEEKLY_CONTAINER.appendChild(weeklyCard);
  });
};
// --- EVENT LISTENERS ---
SEARCH_BUTTON.addEventListener("click", () => {
  getWeatherData(SEARCH_INPUT.value);
});
TRY_BUTTON.addEventListener("click", () => {
  getWeatherData("batumi");
});
SEARCH_INPUT.addEventListener("keydown", (event) => {
  if (event.key === "Enter") SEARCH_BUTTON.click();
});
FAVORITE_BUTTON.addEventListener("click", () => {
  const isFavorite = FAVORITE_PLACES.includes(CURRENT_PLACE);
  FAVORITE_PLACES = isFavorite
    ? FAVORITE_PLACES.filter((city) => city !== CURRENT_PLACE)
    : [...FAVORITE_PLACES, CURRENT_PLACE];
  FAVORITE_STAR.innerHTML = isFavorite ? "☆" : "★";
  localStorage.setItem("favorite-places", JSON.stringify(FAVORITE_PLACES));
  renderFavorites();
});
//# sourceMappingURL=main.js.map
