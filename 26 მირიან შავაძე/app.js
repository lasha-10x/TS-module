"use strict";
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const search = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");
  const toggleBtn = document.querySelector(".toggle-btn");
  const themeBtn = document.querySelector(".theme-btn");
  const wrapper = document.querySelector(".wrapper");
  const loading = document.querySelector(".loading");
  const favoritesContainer = document.querySelector(".favorites-container");
  const cardEl = document.querySelector(".card");
  // Weather Card elements
  const cityEl = document.querySelector(".city-name");
  const tempEl = document.querySelector(".temp");
  const iconEl = document.querySelector(".weather-icon");
  const descEl = document.querySelector(".description");
  const humidityEl = document.querySelector(".humidity-value");
  const pressureEl = document.querySelector(".pressure-value");
  const sunEl = document.querySelector(".sun-value");
  const windEl = document.querySelector(".wind-value");
  const forecastItems = document.querySelectorAll(".forecast-item");
  // State
  let isCelsius = true;
  let isDark = true;
  const key = "13d3557911484c69e8e4e29b09c4f1da";
  let currentWeatherData = null;
  let currentForecastData = null;
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  // Save favorites
  const saveFavorites = () =>
    localStorage.setItem("favorites", JSON.stringify(favorites));
  // Render favorites
  const renderFavorites = () => {
    if (!favoritesContainer) return;
    favoritesContainer.innerHTML = "";
    favorites.forEach((city) => {
      const btn = document.createElement("button");
      btn.className = "fav-btn";
      btn.textContent = city;
      btn.addEventListener("click", () => getWeather(city));
      favoritesContainer.appendChild(btn);
    });
  };
  // Format time from timestamp
  const formatTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    const match = date.toUTCString().match(/(\d{2}:\d{2})/);
    return match ? match[0] : "";
  };
  // Render weather info
  const renderWeather = () => {
    if (!currentWeatherData || !currentForecastData || !wrapper) return;
    const data = currentWeatherData;
    const mainWeather = data.weather[0].main.toLowerCase();
    wrapper.className = `wrapper bg-${mainWeather} ${
      isDark ? "dark" : "light"
    }`;
    const temp = isCelsius
      ? Math.round(data.main.temp)
      : Math.round((data.main.temp * 9) / 5 + 32);
    const tempUnit = isCelsius ? "°C" : "°F";
    if (cityEl) cityEl.textContent = `${data.name}, ${data.sys.country}`;
    if (tempEl) tempEl.textContent = `${temp}${tempUnit}`;
    if (iconEl)
      iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    if (descEl) descEl.textContent = data.weather[0].description;
    if (humidityEl) humidityEl.textContent = `${data.main.humidity}%`;
    if (pressureEl) pressureEl.textContent = `${data.main.pressure} hPa`;
    if (sunEl)
      sunEl.textContent = `${formatTime(
        data.sys.sunrise,
        data.timezone
      )} | ${formatTime(data.sys.sunset, data.timezone)}`;
    if (windEl) windEl.textContent = `${data.wind.speed} m/s`;
    // --- Forecast ---
    const forecastByDate = {};
    currentForecastData.list.forEach((item) => {
      const parts = item.dt_txt.split(" ");
      const dayKey = parts[0];
      if (!dayKey) return; // skip if somehow undefined
      if (!forecastByDate[dayKey]) forecastByDate[dayKey] = [];
      forecastByDate[dayKey].push(item);
    });
    const dates = Object.keys(forecastByDate).slice(1, 6);
    forecastItems.forEach((el, idx) => {
      const dayKey = dates[idx];
      if (!dayKey) return; // ✅ ensures it's a string
      const dayData = forecastByDate[dayKey];
      if (!dayData) return;
      const temps = dayData.map((i) => i.main.temp);
      const minTemp = isCelsius
        ? Math.round(Math.min(...temps))
        : Math.round((Math.min(...temps) * 9) / 5 + 32);
      const maxTemp = isCelsius
        ? Math.round(Math.max(...temps))
        : Math.round((Math.max(...temps) * 9) / 5 + 32);
      const iconItem =
        dayData.find((i) => i.dt_txt.includes("12:00:00")) ?? dayData[0];
      if (!iconItem) return; // ✅ safety check
      const icon = iconItem.weather[0].icon;
      const h5 = el.querySelector("h5");
      const img = el.querySelector("img");
      const p = el.querySelector("p");
      if (h5)
        h5.textContent = new Date(dayKey).toLocaleDateString("en-US", {
          weekday: "short",
        });
      if (img) img.src = `https://openweathermap.org/img/wn/${icon}.png`;
      if (p) p.textContent = `${minTemp}°/${maxTemp}°`;
    });
  };
  // Fetch weather data
  const getWeather = async (city) => {
    if (!city || !cardEl) return;
    // Reset animations
    cardEl.classList.remove("fade-in");
    forecastItems.forEach((el) => el.classList.remove("fade-in"));
    // Trigger fade-out
    cardEl.classList.add("fade-out");
    forecastItems.forEach((el) => el.classList.add("fade-out"));
    try {
      const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
      const data = await (await fetch(URL)).json();
      if (data.cod !== 200) {
        alert("City not found!");
        cardEl.classList.remove("fade-out");
        forecastItems.forEach((el) => el.classList.remove("fade-out"));
        return;
      }
      currentWeatherData = data;
      const forecastData = await (
        await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric`
        )
      ).json();
      currentForecastData = forecastData;
      if (!favorites.includes(data.name)) {
        favorites.push(data.name);
        saveFavorites();
        renderFavorites();
      }
      setTimeout(() => {
        renderWeather();
        cardEl.classList.remove("fade-out");
        cardEl.classList.add("fade-in");
        forecastItems.forEach((el, idx) => {
          el.classList.remove("fade-out");
          el.classList.add("fade-in");
          el.style.transitionDelay = `${idx * 0.1}s`;
        });
      }, 300);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch weather data!");
      cardEl.classList.remove("fade-out");
      forecastItems.forEach((el) => el.classList.remove("fade-out"));
    }
  };
  // Events
  if (searchBtn && search)
    searchBtn.addEventListener("click", () => getWeather(search.value));
  if (search)
    search.addEventListener("keypress", (e) => {
      if (e.key === "Enter") getWeather(search.value);
    });
  if (toggleBtn)
    toggleBtn.addEventListener("click", () => {
      isCelsius = !isCelsius;
      renderWeather();
    });
  if (themeBtn && wrapper) {
    themeBtn.addEventListener("click", () => {
      isDark = !isDark;
      wrapper.classList.toggle("dark", isDark);
      wrapper.classList.toggle("light", !isDark);
      document.body.classList.toggle("dark", isDark);
      document.body.classList.toggle("light", !isDark);
      document
        .querySelectorAll(".search-input, .search-btn, .toggle-btn, .theme-btn")
        .forEach((el) => {
          el.classList.toggle("dark", isDark);
          el.classList.toggle("light", !isDark);
        });
      themeBtn.textContent = isDark ? "🌙" : "☀️";
    });
  }
  const clearFavBtn = document.querySelector(".clear-fav-btn");
  if (clearFavBtn)
    clearFavBtn.addEventListener("click", () => {
      if (!favorites.length) return;
      if (confirm("Are you sure you want to clear all favorites?")) {
        favorites = [];
        saveFavorites();
        renderFavorites();
      }
    });
  // Initial render
  renderFavorites();
});
//# sourceMappingURL=app.js.map
