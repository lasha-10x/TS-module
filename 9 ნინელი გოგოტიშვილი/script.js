// -----------------------------
// DOM Elements
// -----------------------------
const mainContainer = document.querySelector("#main-container");
const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");
const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date-txt");
const forecastItemsContainer = document.querySelector(".forecast-items-container");
const favBtn = document.querySelector("#fav-btn");
const cityNameEl = document.querySelector("#city-name");
const citySelEl = document.querySelector("#citySelection");
const preloaderEl = document.querySelector(".preloader");
const unitToggleBtn = document.querySelector("#unit-toggle");
const sectionsContainer = document.querySelector("#sections-container");
const googleMapLinkEl = document.querySelector(".google-map-link");
const themeTogglerEl = document.querySelector("#theme-switcher");
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
function getLastViewedCity() {
    const city = localStorage.getItem("lastViewedCity");
    if (city)
        return city;
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
    cityInput.addEventListener("focus", () => showCityDropdown(getCityListFromLocalStorage(), updateWeatherInfo));
}
function toggleFavorite() {
    const cityName = getCityName();
    if (!cityName)
        return;
    let cities = getCityListFromLocalStorage();
    const cityLower = cityName.toLowerCase();
    if (cities.includes(cityLower)) {
        cities = cities.filter((c) => c !== cityLower);
        favBtn.textContent = "star";
    }
    else {
        cities.push(cityLower);
        favBtn.textContent = "stars";
    }
    if (!cities.length)
        localStorage.removeItem("cities");
    else
        localStorage.setItem("cities", JSON.stringify(cities));
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
function handleEnterSearch(event) {
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
    if (city)
        updateWeatherInfo(city);
}
function handleThemeToggle(evt) {
    const target = evt.currentTarget;
    if (target.checked) {
        document.documentElement.style.setProperty("--main-bg", "var(--bg-light)");
        document.documentElement.style.setProperty("--main-color", "var(--text-light)");
        document.documentElement.style.setProperty("--main-bg-rgb", "var(--bg-light-rgb)");
        document.documentElement.style.setProperty("--main-color-rgb", "var(--text-light-rgb)");
    }
    else {
        document.documentElement.style.setProperty("--main-bg", "var(--bg-dark)");
        document.documentElement.style.setProperty("--main-color", "var(--text-dark)");
        document.documentElement.style.setProperty("--main-bg-rgb", "var(--bg-dark-rgb)");
        document.documentElement.style.setProperty("--main-color-rgb", "var(--text-dark-rgb)");
    }
}
function getCityName() {
    return cityNameEl.textContent?.trim() ?? "";
}
function getCityListFromLocalStorage() {
    const data = localStorage.getItem("cities");
    return data ? JSON.parse(data) : [];
}
function cityExists(city) {
    const cities = getCityListFromLocalStorage();
    return cities.includes(city.toLowerCase());
}
function setTemperatureScaleUnit(unit) {
    localStorage.setItem("temperatureScaleUnit", unit);
}
function getTemperatureScaleUnit() {
    return localStorage.getItem("temperatureScaleUnit") || "C";
}
function updateUnitToggleButton(currentScale) {
    unitToggleBtn.textContent =
        currentScale === "C" ? "Switch to °F" : "Switch to °C";
}
function showCityDropdown(cities, onSelectCity) {
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
async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    return response.json();
}
function getWeatherIcon(id) {
    if (id <= 232)
        return "thunderstorm.svg";
    if (id <= 321)
        return "drizzle.svg";
    if (id <= 531)
        return "rain.svg";
    if (id <= 622)
        return "snow.svg";
    if (id <= 781)
        return "atmosphere.svg";
    if (id === 800)
        return "clear.svg";
    return "clouds.svg";
}
function getCurrentDate() {
    return new Date().toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
    });
}
function celsius2fahrenheit(celsius) {
    if (isNaN(celsius))
        return NaN;
    return Math.round((celsius * 9) / 5 + 32);
}
function togglePreloader(show) {
    preloaderEl.style.display = show ? "flex" : "none";
}
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection].forEach((s) => (s.style.display = "none"));
    section.style.display = "flex";
}
async function updateWeatherInfo(city) {
    togglePreloader(true);
    const weatherData = await getFetchData("weather", city);
    if (Number(weatherData.cod) !== 200) {
        showDisplaySection(notFoundSection);
        togglePreloader(false);
        return;
    }
    localStorage.setItem("lastViewedCity", city);
    const { name: country, main: { temp, humidity }, weather, wind: { speed }, coord: { lat, lon }, } = weatherData;
    const weatherItem = weather[0] ?? { id: 800, main: "" };
    const scaleUnit = getTemperatureScaleUnit();
    const displayTemp = scaleUnit === "C"
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
async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData("forecast", city);
    forecastItemsContainer.innerHTML = "";
    const todayDate = new Date().toISOString().split("T")[0];
    const dailyForecasts = {};
    forecastsData.list.forEach((item) => {
        if (!item.dt_txt)
            return;
        const itemDate = item.dt_txt.split(" ")[0];
        if (itemDate !== todayDate) {
            if (!dailyForecasts[itemDate])
                dailyForecasts[itemDate] = [];
            dailyForecasts[itemDate].push(item);
        }
    });
    Object.keys(dailyForecasts).forEach((date) => {
        const dayData = dailyForecasts[date];
        if (!dayData)
            return;
        let minTemp = Infinity;
        let maxTemp = -Infinity;
        let forecast = null;
        dayData.forEach((entry) => {
            const temp = entry.main.temp;
            if (temp < minTemp)
                minTemp = temp;
            if (temp > maxTemp)
                maxTemp = temp;
            forecast = entry;
        });
        if (forecast)
            updateForecastItem(forecast, minTemp, maxTemp);
    });
}
function updateForecastItem(forecast, minTemp, maxTemp) {
    const { dt_txt: date, weather } = forecast;
    const weatherItem = weather[0] ?? { id: 800, main: "" };
    const dateResult = new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
    });
    const scaleUnit = getTemperatureScaleUnit();
    let minMaxTemp = scaleUnit === "C"
        ? Math.round(minTemp).toString()
        : celsius2fahrenheit(minTemp).toString();
    if (maxTemp > minTemp) {
        const maxResolved = scaleUnit === "C" ? Math.round(maxTemp) : celsius2fahrenheit(maxTemp);
        minMaxTemp += ` - ${maxResolved}`;
    }
    minMaxTemp += scaleUnit === "C" ? " °C" : " °F";
    const forecastItemHTML = `
    <div class="forecast-item">
      <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
      <img src="assets/weather/${getWeatherIcon(weatherItem.id)}" class="firecast-item-img">
      <h5 class="forecast-item-temp">${minMaxTemp}</h5>
    </div>
  `;
    forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItemHTML);
}
function updateBackground(id, temp) {
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
    else if (id === 800)
        gradient = "linear-gradient(to top, #f7971e, #ffd200)";
    else if (id > 800)
        gradient = "linear-gradient(to top, #757f9a, #d7dde8)";
    if (temp <= 0)
        gradient = "linear-gradient(to top, #83a4d4, #b6fbff)";
    else if (temp >= 30)
        gradient = "linear-gradient(to top, #ff512f, #f09819)";
    container.style.background = gradient;
}
export {};
//# sourceMappingURL=script.js.map