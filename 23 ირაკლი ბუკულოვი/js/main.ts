// main.ts

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const liveDate = document.getElementById("live-date") as HTMLElement | null;
  const liveTime = document.getElementById("live-time") as HTMLElement | null;

  const API_KEY: string = "02474d6e520bd97a7035ae71847dc175"; // OpenWeatherMap API key

  const inp = document.getElementById("city-input") as HTMLInputElement | null;
  const btn = document.getElementById("search-btn") as HTMLButtonElement | null;
  const loader = document.getElementById("loader") as HTMLElement | null;
  const content = document.getElementById("app-content") as HTMLElement | null;
  const errMsg = document.getElementById("error-message") as HTMLElement | null;

  const nowTemp = document.getElementById("current-temp") as HTMLElement | null;
  const nowCity = document.getElementById("current-city") as HTMLElement | null;
  const nowDesc = document.getElementById(
    "current-description"
  ) as HTMLElement | null;
  const nowIcon = document.getElementById(
    "current-weather-icon"
  ) as HTMLImageElement | null;
  const feels = document.getElementById("feels-like") as HTMLElement | null;
  const hum = document.getElementById("humidity") as HTMLElement | null;
  const wind = document.getElementById("wind-speed") as HTMLElement | null;
  const press = document.getElementById("pressure") as HTMLElement | null;

  const forecastContainer = document.getElementById(
    "forecast-container"
  ) as HTMLElement | null;

  // Types for API responses
  interface CurrentWeatherResponse {
    name: string;
    sys: { country: string };
    weather: { id: number; description: string; icon: string }[];
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
    wind: { speed: number };
  }

  interface ForecastResponse {
    list: {
      dt: number;
      main: { temp: number };
      weather: { description: string; icon: string }[];
    }[];
  }

  // Time updater
  function updateTime(): void {
    const now = new Date();
    if (liveDate) {
      liveDate.innerText = now.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    if (liveTime) {
      liveTime.innerText = now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
  }

  setInterval(updateTime, 1000);
  updateTime();

  // UI Helpers
  function showLoader(): void {
    if (loader) loader.classList.remove("hidden");
    if (content) content.style.opacity = "0.5";
  }

  function hideLoader(): void {
    if (loader) loader.classList.add("hidden");
    if (content) content.style.opacity = "1";
  }

  function showError(msg: string): void {
    if (errMsg) {
      errMsg.innerText = msg;
      errMsg.classList.remove("hidden");
    }
  }

  function hideError(): void {
    if (errMsg) errMsg.classList.add("hidden");
  }

  function KtoC(k: number): string {
    return (k - 273.15).toFixed(0);
  }

  // Main weather loader
  async function loadWeather(city: string): Promise<void> {
    showLoader();
    hideError();

    try {
      // Current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error("City not found");
      const data: CurrentWeatherResponse = await res.json();

      // Update current weather UI
      if (nowTemp) nowTemp.innerText = `${KtoC(data.main.temp)}°C`;
      if (nowCity) nowCity.innerText = `${data.name}, ${data.sys.country}`;
      if (nowDesc)
        nowDesc.innerText = data.weather[0]!.description.split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      if (nowIcon) {
        nowIcon.src = `https://openweathermap.org/img/wn/${
          data.weather[0]!.icon
        }@4x.png`;
        nowIcon.alt = data.weather[0]!.description;
      }
      if (feels) feels.innerText = `${KtoC(data.main.feels_like)}°C`;
      if (hum) hum.innerText = `${data.main.humidity}%`;
      if (wind) wind.innerText = `${data.wind.speed.toFixed(1)} m/s`;
      if (press) press.innerText = `${data.main.pressure} hPa`;

      // Background logic
      const id = data.weather[0]!.id;
      const ic = data.weather[0]!.icon;
      const night = ic.includes("n");
      let bg = "bg-default";
      if (id >= 200 && id < 300) bg = "bg-thunderstorm";
      else if (id >= 300 && id < 400) bg = "bg-drizzle";
      else if (id >= 500 && id < 600) bg = "bg-rain";
      else if (id >= 600 && id < 700) bg = "bg-snow";
      else if (id >= 700 && id < 800) bg = "bg-atmosphere";
      else if (id === 800) bg = night ? "bg-clear-night" : "bg-clear";
      else if (id > 800) bg = night ? "bg-clouds-night" : "bg-clouds";

      document.body.className = `text-white transition-background ${bg}`;

      // Forecast
      const fRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`
      );
      const fData: ForecastResponse = await fRes.json();

      if (forecastContainer) forecastContainer.innerHTML = "";

      const forecastList = fData.list;
      const dailyForecasts: Record<string, ForecastResponse["list"][0]> = {};

      forecastList.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short",
        });
        if (!dailyForecasts[date]) {
          const forecastForDay = forecastList.find(
            (f) =>
              new Date(f.dt * 1000).getDate() ===
                new Date(item.dt * 1000).getDate() &&
              new Date(f.dt * 1000).getHours() >= 12
          );
          if (forecastForDay) {
            dailyForecasts[date] = forecastForDay;
          }
        }
      });

      const today = new Date().toLocaleDateString("en-US", {
        weekday: "short",
      });
      delete dailyForecasts[today];

      Object.values(dailyForecasts)
        .slice(0, 4)
        .forEach((item) => {
          const day = new Date(item.dt * 1000).toLocaleDateString("en-US", {
            weekday: "short",
          });
          const temp = KtoC(item.main.temp);
          const icon = item.weather[0]!.icon;

          const forecastItem = document.createElement("div");
          forecastItem.className = "text-center p-2 rounded-lg bg-white/10";
          forecastItem.innerHTML = `
            <p class="font-semibold">${day}</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${
            item.weather[0]!.description
          }" class="mx-auto w-12 h-12">
            <p class="font-medium">${temp}°C</p>
          `;
          if (forecastContainer) forecastContainer.appendChild(forecastItem);
        });
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An error occurred";
      showError(message);
    } finally {
      hideLoader();
    }
  }

  // Event listeners
  if (btn) {
    btn.addEventListener("click", () => {
      const city = inp?.value.trim();
      if (city) loadWeather(city);
    });
  }

  if (inp) {
    inp.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const city = inp.value.trim();
        if (city) loadWeather(city);
      }
    });
  }

  // Default load
  loadWeather("Batumi");
});
