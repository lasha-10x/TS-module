"use strict";
// weatherApp.ts
const apiKey = "e96f98a7a2898c4e4f62aee037961831";
// -----------------------------
// Utility Functions
// -----------------------------
function getElement(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Element with id "${id}" not found`);
  return el;
}
function getWeatherImageSrc(condition) {
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
// Display Forecast
// -----------------------------
function displayForecast(data) {
  const dailyForecasts = {};
  const forecastEl = getElement("future-forecast-box");
  let forecastHTML = "";
  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayIndex = new Date(date).getDay();
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        day_today: dayNames[dayIndex],
        temperature: `${Math.floor(item.main.temp)}°`,
        description: item.weather[0].description,
        weatherImg: item.weather[0].main,
      };
    }
  });
  for (const date in dailyForecasts) {
    const forecast = dailyForecasts[date];
    const imgSrc = getWeatherImageSrc(forecast.weatherImg);
    forecastHTML += `
      <div class="weather-forecast-box">
        <div class="day-weather">
          <span>${forecast.day_today}</span>
        </div>
        <div class="weather-icon-forecast">
          <img src="${imgSrc}" />
        </div>
        <div class="temp-weather">
          <span>${forecast.temperature}</span>
        </div>
        <div class="weather-main-forecast">${forecast.description}</div>
      </div>
    `;
  }
  forecastEl.innerHTML = forecastHTML;
}
// -----------------------------
// Main Function
// -----------------------------
async function loadWeather() {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // Get city name from coordinates
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
        );
        const geoData = await geoRes.json();
        const loc = geoData[0]?.name;
        if (!loc) throw new Error("Unable to determine city from coordinates");
        // Get weather data
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${loc}&units=metric&appid=${apiKey}`
        );
        const weatherData = await weatherRes.json();
        console.log(weatherData);
        // Display current weather
        const cityMain = getElement("city-name");
        const cityTemp = getElement("metric");
        const weatherMain = document.querySelectorAll("#weather-main");
        const mainHumidity = getElement("humidity");
        const mainFeel = getElement("feels-like");
        const weatherImg = getElement("weather-icon");
        const weatherImgs = getElement("weather-icons");
        const tempMinWeather = getElement("temp-min-today");
        const tempMaxWeather = getElement("temp-max-today");
        const current = weatherData.list[0];
        cityMain.innerText = weatherData.city.name;
        cityTemp.innerText = `${Math.floor(current.main.temp)}°`;
        weatherMain[0].innerText = current.weather[0].description;
        weatherMain[1].innerText = current.weather[0].description;
        mainHumidity.innerText = `${Math.floor(current.main.humidity)}`;
        mainFeel.innerText = `${Math.floor(current.main.feels_like)}`;
        tempMinWeather.innerText = `${Math.floor(current.main.temp_min)}°`;
        tempMaxWeather.innerText = `${Math.floor(current.main.temp_max)}°`;
        const weatherCondition = current.weather[0].main;
        const imgSrc = getWeatherImageSrc(weatherCondition);
        weatherImg.src = imgSrc;
        weatherImgs.src = imgSrc;
        // Display 5-day forecast
        displayForecast(weatherData);
      } catch (error) {
        console.error("An error occurred:", error);
        alert("Failed to load weather data. Please try again later.");
      }
    },
    () => {
      alert("Please enable location services and refresh the page.");
    }
  );
}
// -----------------------------
// Init
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadWeather();
});
//# sourceMappingURL=main.js.map
