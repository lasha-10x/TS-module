let isFahrenheit: boolean = false;
const apiKey: string = "829e4db07d583fbc19efa82060ebd74c";
const baseUrl: string = "https://api.openweathermap.org/data/2.5/";

// Select elements
const loading = document.getElementById("loading") as HTMLDivElement | null;
const cityInput = document.getElementById(
  "cityInput"
) as HTMLInputElement | null;
const searchBtn = document.getElementById(
  "searchBtn"
) as HTMLButtonElement | null;
const unitToggle = document.getElementById(
  "unitToggle"
) as HTMLInputElement | null;
const themeSwitch = document.getElementById(
  "themeSwitch"
) as HTMLInputElement | null;
const favoritesList = document.getElementById(
  "favoritesList"
) as HTMLUListElement | null;

function showLoading() {
  if (loading) loading.classList.remove("hidden");
}

function hideLoading() {
  if (loading) loading.classList.add("hidden");
}

// Toggle units
unitToggle?.addEventListener("change", () => {
  isFahrenheit = unitToggle.checked;
  const city = document.getElementById("cityName")?.textContent;
  if (city && city !== "City not found") {
    getWeather(city);
    getForecast(city);
  }
});

// Search button
searchBtn?.addEventListener("click", () => {
  const city = cityInput?.value.trim();
  if (city) {
    saveFavorite(city);
    getWeather(city);
    getForecast(city);
  } else {
    alert("Please enter a city name.");
  }
});

// Theme switch
themeSwitch?.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", themeSwitch.checked);
});

// Favorites
function saveFavorite(city: string) {
  const favorites: string[] = JSON.parse(
    localStorage.getItem("favorites") || "[]"
  );
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
  }
}

function renderFavorites() {
  if (!favoritesList) return;
  favoritesList.innerHTML = "";
  const favorites: string[] = JSON.parse(
    localStorage.getItem("favorites") || "[]"
  );
  favorites.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      getWeather(city);
      getForecast(city);
    });
    favoritesList.appendChild(li);
  });
}
renderFavorites();

// Background based on weather
function setBackgroundByWeather(id: number) {
  document.body.className = ""; // clear all styles
  if (id >= 200 && id < 300) document.body.classList.add("thunderstorm");
  else if (id >= 300 && id < 600) document.body.classList.add("rain");
  else if (id >= 600 && id < 700) document.body.classList.add("snow");
  else if (id >= 700 && id < 800) document.body.classList.add("wind");
  else if (id === 800) document.body.classList.add("sunny");
  else if (id > 800) document.body.classList.add("clouds");
}

// Get current weather
async function getWeather(city: string) {
  const unit = isFahrenheit ? "imperial" : "metric";
  showLoading();
  try {
    const res = await fetch(
      `${baseUrl}weather?q=${city}&appid=${apiKey}&units=${unit}`
    );
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

    (document.getElementById("cityName") as HTMLDivElement).textContent =
      data.name;
    (document.getElementById("temperature") as HTMLDivElement).textContent = `${
      data.main.temp
    }°${isFahrenheit ? "F" : "C"}`;
    (document.getElementById("description") as HTMLDivElement).textContent =
      data.weather[0].description;
    (
      document.getElementById("humidity") as HTMLDivElement
    ).textContent = `Humidity: ${data.main.humidity}%`;
    (
      document.getElementById("wind") as HTMLDivElement
    ).textContent = `Wind: ${data.wind.speed} m/s`;
    (
      document.getElementById("sunrise") as HTMLDivElement
    ).textContent = `Sunrise: ${sunrise}`;
    (
      document.getElementById("sunset") as HTMLDivElement
    ).textContent = `Sunset: ${sunset}`;

    const icon = document.getElementById("weatherIcon") as HTMLElement | null;
    if (icon) icon.className = `wi wi-owm-${data.weather[0].id}`;

    setBackgroundByWeather(data.weather[0].id);
  } catch (err) {
    (document.getElementById("cityName") as HTMLDivElement).textContent =
      "City not found";
  } finally {
    hideLoading();
  }
}

// Get forecast
async function getForecast(city: string) {
  const unit = isFahrenheit ? "imperial" : "metric";
  showLoading();
  try {
    const res = await fetch(
      `${baseUrl}forecast?q=${city}&appid=${apiKey}&units=${unit}`
    );
    if (!res.ok) throw new Error("Forecast not available");
    const data = await res.json();
    const forecastContainer = document.getElementById(
      "forecastContainer"
    ) as HTMLDivElement | null;
    if (!forecastContainer) return;
    forecastContainer.innerHTML = "";

    const daily = data.list.filter((item: any) =>
      item.dt_txt.includes("12:00:00")
    );

    daily.forEach((day: any) => {
      const date = new Date(day.dt_txt);
      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
                <p><strong>${date.toDateString().slice(0, 10)}</strong></p>
                <i class="wi wi-owm-${day.weather[0].id} forecast-icon"></i>
                <p>${day.main.temp_min}° / ${day.main.temp_max}° ${
        isFahrenheit ? "F" : "C"
      }</p>
            `;
      forecastContainer.appendChild(card);
    });
  } catch (err) {
    const forecastContainer = document.getElementById(
      "forecastContainer"
    ) as HTMLDivElement | null;
    if (forecastContainer)
      forecastContainer.innerHTML = "<p>Error loading forecast</p>";
  } finally {
    hideLoading();
  }
}
