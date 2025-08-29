"use strict";
// weatherSearch.ts
const apiKey = "e96f98a7a2898c4e4f62aee037961831";
// -----------------------------
// Utility function to get DOM elements safely
// -----------------------------
function getElement(selector) {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Element with selector "${selector}" not found`);
  return el;
}
// -----------------------------
// Get Weather Image based on condition
// -----------------------------
function getWeatherImage(condition) {
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
async function search(city, state, country) {
  try {
    const query = [city, state, country].filter(Boolean).join(",");
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${query}&appid=${apiKey}`
    );
    if (!response.ok) {
      throw new Error("City not found or API error");
    }
    const data = await response.json();
    console.log(data);
    // Show results
    const box = getElement(".return");
    box.style.display = "block";
    getElement(".message").style.display = "none";
    getElement(".error-message").style.display = "none";
    const weatherImg = getElement(".weather-img");
    getElement(".city-name").innerText = data.name;
    getElement(".weather-temp").innerText = `${Math.floor(data.main.temp)}°`;
    getElement(".wind").innerText = `${Math.floor(data.wind.speed)} m/s`;
    getElement(".pressure").innerText = `${Math.floor(data.main.pressure)} hPa`;
    getElement(".humidity").innerText = `${Math.floor(data.main.humidity)}%`;
    getElement(".sunrise").innerText = new Date(
      data.sys.sunrise * 1000
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    getElement(".sunset").innerText = new Date(
      data.sys.sunset * 1000
    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    weatherImg.src = getWeatherImage(data.weather[0].main);
  } catch (error) {
    console.error(error);
    getElement(".return").style.display = "none";
    getElement(".message").style.display = "none";
    getElement(".error-message").style.display = "block";
  }
}
// -----------------------------
// Event Listener for Search Input
// -----------------------------
const searchInput = getElement(".searchinput");
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    search(searchInput.value);
    console.log("Search triggered");
  }
});
//# sourceMappingURL=search.js.map
