interface WeatherCondition {
  text: string;
  icon: string;
}

interface DayForecast {
  avgtemp_c: number;
  condition: WeatherCondition;
}

interface ForecastDay {
  date: string;
  day: DayForecast;
}

interface WeatherForecast {
  forecastday: ForecastDay[];
}

interface WeatherData {
  forecast: WeatherForecast;
}

const API_KEY: string = "549dfba1f8fa41a2a8b132707252706";

const forecastContainer = document.getElementById("forecast") as HTMLElement;
const searchForm = document.getElementById("searchForm") as HTMLFormElement;
const searchInput = document.getElementById("search") as HTMLInputElement;

// fetch weather data
async function fetchForecast(city: string): Promise<void> {
  forecastContainer.innerHTML = `<p>Loading weather for ${city}...</p>`;

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7`
    );
    const data: WeatherData = await res.json();

    if (!data.forecast) {
      forecastContainer.innerHTML = `<p>Could not load forecast for "${city}"</p>`;
      return;
    }

    displayForecast(data.forecast.forecastday);
  } catch (err) {
    console.error(err);
    forecastContainer.innerHTML = `<p>Error fetching weather data</p>`;
  }
}

// render forecast cards
function displayForecast(days: ForecastDay[]): void {
  forecastContainer.innerHTML = "";

  days.forEach((day: ForecastDay) => {
    const weekday = new Date(day.date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const card = document.createElement("div");
    card.className = "forecast-day-card";

    card.innerHTML = `
      <p>${weekday}</p>
      <p>${day.day.avgtemp_c}°C</p>
      <p>${day.day.condition.text}</p>
      <img src="${day.day.condition.icon}" alt="weather icon" />
    `;

    forecastContainer.appendChild(card);
  });
}

// handle form submit
searchForm.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (city !== "") {
    fetchForecast(city);
  }
});

// initial fetch
fetchForecast("London");

// Get the toggle button element
const toggleBtn = document.getElementById("themeToggle") as HTMLButtonElement;

// Add click event listener
toggleBtn.addEventListener("click", () => {
  // Toggle the dark-mode class on the body
  document.body.classList.toggle("dark-mode");

  // Update the button text based on current mode
  if (document.body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "Switch to Light Mode";
  } else {
    toggleBtn.textContent = "Switch to Dark Mode";
  }
});
