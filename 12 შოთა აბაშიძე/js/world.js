"use strict";
// weatherApp.ts
const apiKey = "e96f98a7a2898c4e4f62aee037961831";
// -----------------------------
// Utility function for safe DOM access
// -----------------------------
function getElement(selector) {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Element with selector "${selector}" not found`);
  return el;
}
// -----------------------------
// Set current date
// -----------------------------
const dateEl = getElement(".date");
const today = new Date();
const months_name = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
dateEl.innerHTML = `${
  months_name[today.getMonth()]
} ${today.getDate()}, ${today.getFullYear()}`;
// -----------------------------
// DOM Elements
// -----------------------------
const searchInput = getElement(".searchinput");
const boxContainer = getElement(".box");
const normalMessage = getElement(".normal-message");
const errorMessage = getElement(".error-message");
const addedMessage = getElement(".added-message");
const section = getElement(".add-section");
const navBtn = getElement(".button");
const navIcon = getElement(".btn-icon");
// -----------------------------
// Toggle Add Section
// -----------------------------
navBtn.addEventListener("click", () => {
  if (section.style.top === "-60rem") {
    section.style.top = "100px";
    navIcon.className = "fa-solid fa-circle-xmark";
  } else {
    section.style.top = "-60rem";
    navIcon.className = "fa-solid fa-circle-plus";
  }
});
// -----------------------------
// Map Weather to Image
// -----------------------------
function getWeatherImage(condition) {
  const key = condition.toLowerCase();
  switch (key) {
    case "rain":
      return "img/rain.png";
    case "clear":
    case "clear sky":
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
// Fetch City Weather
// -----------------------------
async function city(cityName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    // Create elements
    const weatherBox = document.createElement("div");
    weatherBox.className = "weather-box";
    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    const cityElement = document.createElement("div");
    cityElement.className = "city-name city";
    cityElement.innerText = data.name;
    const tempElement = document.createElement("div");
    tempElement.className = "weather-temp temp";
    tempElement.innerText = `${Math.floor(data.main.temp)}°`;
    const weatherIconDiv = document.createElement("div");
    weatherIconDiv.className = "weather-icon";
    const weatherImg = document.createElement("img");
    weatherImg.className = "weather";
    weatherImg.src = getWeatherImage(data.weather[0].main);
    // Append elements
    weatherIconDiv.appendChild(weatherImg);
    nameDiv.appendChild(cityElement);
    nameDiv.appendChild(tempElement);
    weatherBox.appendChild(nameDiv);
    weatherBox.appendChild(weatherIconDiv);
    boxContainer.appendChild(weatherBox);
    return weatherBox;
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}
// -----------------------------
// Search Input Event
// -----------------------------
searchInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const weatherInfo = await city(searchInput.value);
    if (weatherInfo) {
      normalMessage.style.display = "none";
      errorMessage.style.display = "none";
      addedMessage.style.display = "block";
      boxContainer.prepend(weatherInfo);
    } else {
      normalMessage.style.display = "none";
      errorMessage.style.display = "block";
      addedMessage.style.display = "none";
    }
  }
});
// -----------------------------
// Load default cities
// -----------------------------
city("Batumi");
city("Tbilisi");
city("Kutaisi");
//# sourceMappingURL=world.js.map
