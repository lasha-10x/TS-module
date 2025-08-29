"use strict";
// main.ts
const myApiKey = "ffda1be21c57d59826201081fa8e338c";
const limit = 1;
let units = "metric";
async function getWeatherDataForCityFromApi(city) {
  try {
    const locationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${myApiKey}`;
    const locationResponse = await fetch(locationUrl);
    const locationData = await locationResponse.json();
    if (!locationData || locationData.length === 0) {
      alert("City not found");
      return null;
    }
    const loc = locationData[0];
    const lat = loc.lat;
    const lon = loc.lon;
    const locationName = `${loc.name}, ${loc.country}`;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=${units}`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    const fiveDaysInfoArray = getInfoForNextFiveDays(weatherData);
    writeAllDays(fiveDaysInfoArray);
    return { weather: weatherData, locationName };
  } catch (error) {
    console.error(error);
    alert(error.message || "Failed to fetch weather data");
    return null;
  }
}
function writeCityName(name) {
  const el = document.getElementById("city");
  if (el) el.innerHTML = name;
}
function writeTemperature(temperature) {
  const el = document.getElementById("temperature");
  if (el) el.innerHTML = `${temperature}&deg;`;
}
function writeAllDays(fiveDaysInfoArray) {
  const container = document.getElementById("five-days-container");
  if (!container) return;
  container.textContent = "";
  container.style.display = "flex";
  container.style.justifyContent = "space-between";
  fiveDaysInfoArray.forEach((item) => {
    const card = document.createElement("div");
    card.style.fontWeight = "bold";
    card.style.fontSize = "16px";
    card.style.height = "100px";
    card.style.width = "200px";
    card.style.borderRadius = "20px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.transition = "transform 0.4s ease, box-shadow 0.4s ease";
    card.style.backgroundColor = "#fff";
    card.style.marginTop = "50px";
    card.style.padding = "20px";
    card.addEventListener("mouseenter", () => {
      card.style.transform = "scale(1.05)";
      card.style.boxShadow = "0 15px 35px rgba(0,0,0,0.2)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "scale(1)";
      card.style.boxShadow = "none";
    });
    card.innerHTML = `
      <div>${item.date}</div>
      <div>Min: ${item.min}</div>
      <div>Max: ${item.max}</div>
    `;
    container.appendChild(card);
  });
}
function getInfoForOneDay(list, day) {
  const filtered = list.filter(
    (listItem) => listItem.dt_txt.slice(0, 10) === day
  );
  const temps = filtered.map((listItem) => listItem.main.temp);
  return { minTemp: Math.min(...temps), maxTemp: Math.max(...temps) };
}
function getInfoForNextFiveDays(weatherData) {
  const fiveDays = [];
  for (let i = 1; i <= 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const formattedDate = date.toISOString().split("T")[0];
    const dayInfo = getInfoForOneDay(weatherData.list, formattedDate);
    fiveDays.push({
      date: formattedDate,
      min: dayInfo.minTemp,
      max: dayInfo.maxTemp,
    });
  }
  return fiveDays;
}
function showWeather(city) {
  const spinner = document.getElementById("spinner");
  if (spinner) spinner.style.display = "block";
  getWeatherDataForCityFromApi(city).then((data) => {
    if (!data) {
      writeCityName("NOT FOUND");
      if (spinner) spinner.style.display = "none";
      return;
    }
    writeCityName(data.locationName);
    writeTemperature(Math.round(data.weather.list[0].main.temp));
    if (spinner) spinner.style.display = "none";
  });
}
// Event listeners
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityinput");
searchBtn?.addEventListener("click", () => {
  if (cityInput.value) showWeather(cityInput.value);
});
cityInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && cityInput.value) showWeather(cityInput.value);
});
// Initialize default city
showWeather("Tbilisi");
//# sourceMappingURL=script.js.map
