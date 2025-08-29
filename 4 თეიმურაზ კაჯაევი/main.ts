const apiKey = "329f0f349944cf5f59ccd05677f27437";

// DOM elements
const cityNameEl = document.querySelector(".t-city-name") as HTMLElement;
const tempEl = document.querySelector(".t-temp") as HTMLElement;
const descEl = document.querySelector(".t-description") as HTMLElement;
const iconEl = document.querySelector(".t-weather-icon") as HTMLImageElement;
const searchBtn = document.getElementById("t-search-btn") as HTMLButtonElement;
const cityInput = document.getElementById("t-city-input") as HTMLInputElement;
const forecastContainer = document.querySelector(
  ".t-forecast-cards"
) as HTMLElement;

let unit: "metric" | "imperial" = "metric";

// Fetch current weather
async function fetchWeather(city: string) {
  try {
    showLoading();

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`
    );
    if (!res.ok) throw new Error();

    const data: any = await res.json();

    const unitSymbol = unit === "metric" ? "°C" : "°F";

    cityNameEl.textContent = data.name ?? "N/A";
    tempEl.textContent = `${Math.round(data.main?.temp ?? 0)}${unitSymbol}`;
    descEl.textContent = data.weather?.[0]?.description ?? "N/A";
    iconEl.src = data.weather?.[0]?.icon
      ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      : "";

    localStorage.setItem("lastCity", city);
  } catch {
    alert("City not found.");
  }
}

// Fetch forecast
async function fetchForecast(city: string) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`
    );
    if (!res.ok) throw new Error();

    const data: any = await res.json();
    const forecastList = data.list.filter((i: any) =>
      i.dt_txt.includes("12:00:00")
    );

    forecastContainer.innerHTML = "";

    forecastList.forEach((day: any) => {
      const date = new Date(day.dt_txt);
      const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
      const icon = day.weather?.[0]?.icon ?? "default";
      const min = Math.round(day.main?.temp_min ?? 0);
      const max = Math.round(day.main?.temp_max ?? 0);

      forecastContainer.innerHTML += `
        <div class="t-forecast-card">
          <p>${weekday}</p>
          <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Icon" />
          <p>${max}° / ${min}°</p>
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}

// Combined fetch
async function fetchWeatherWithForecast(city: string) {
  await fetchWeather(city);
  await fetchForecast(city);
}

// Search
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Please enter a city name.");
    return;
  }
  fetchWeatherWithForecast(city);
});

// Loading effect
function showLoading() {
  tempEl.textContent = "...";
  descEl.textContent = "Loading...";
  iconEl.src = "";
}

// °C / °F toggle
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "Switch °C/°F";
toggleBtn.style.marginTop = "10px";
toggleBtn.onclick = () => {
  unit = unit === "metric" ? "imperial" : "metric";
  if (cityNameEl.textContent) fetchWeatherWithForecast(cityNameEl.textContent);
};
(document.querySelector(".t-weather-display") as HTMLElement).appendChild(
  toggleBtn
);

// Default city
const lastCity = localStorage.getItem("lastCity") || "Tbilisi";
fetchWeatherWithForecast(lastCity);
