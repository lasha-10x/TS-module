import {
  WeatherService,
  WeatherData,
  ForecastDay,
} from "./wheather-service.js";
import { UI } from "./ui-manager.js";
import { StorageService } from "./storage-service.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = new WeatherApp();
  app.init();
});

// -----------------------------
// WeatherApp
// -----------------------------
export class WeatherApp {
  private apiKey: string;
  private weatherService: WeatherService;
  private storageService: StorageService;
  private ui: UI;

  constructor() {
    this.apiKey = "4839457010f81ec76815df2b63a09a87";
    this.weatherService = new WeatherService(this.apiKey);
    this.storageService = new StorageService();
    this.ui = new UI();

    this.initEventListeners();
  }

  init(): void {
    const cities = this.storageService.getCities();
    const lastCity = cities[cities.length - 1] ?? "Batumi"; // default city if undefined
    this.updateWeather(lastCity);

    this.ui.updateUnitToggleButton(
      this.storageService.getTemperatureScaleUnit()
    );
  }

  private initEventListeners(): void {
    // Show dropdown when input is focused
    this.ui.cityInput!.addEventListener("focus", () =>
      this.ui.showCityDropdown(
        this.storageService.getCities(),
        this.updateWeather.bind(this)
      )
    );

    // Search button click
    this.ui.searchBtn!.addEventListener("click", () => {
      const city = this.ui.cityInput!.value.trim();
      if (city) {
        this.updateWeather(city);
        this.ui.resetInput();
      }
    });

    // Enter key press
    this.ui.cityInput!.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const city = this.ui.cityInput!.value.trim();
        if (city) {
          this.updateWeather(city);
          this.ui.resetInput();
        }
      }
    });

    // Favorite button
    this.ui.favBtn!.addEventListener("click", () => this.toggleFavorite());

    // Temperature unit toggle
    this.ui.unitToggleBtn!.addEventListener("click", () => {
      const currentScale = this.storageService.getTemperatureScaleUnit();
      const newScale: "C" | "F" = currentScale === "C" ? "F" : "C";
      this.storageService.setTemperatureScaleUnit(newScale);
      this.ui.updateUnitToggleButton(newScale);

      const city = this.ui.getCityName();
      if (city) this.updateWeather(city);
    });

    // Hide dropdown on click outside
    this.ui.sectionsContainer!.addEventListener("click", () => {
      this.ui.hideCityDropdown();
    });
  }

  private async updateWeather(city: string): Promise<void> {
    this.ui.togglePreloader(true);

    try {
      const data: WeatherData = await this.weatherService.getCurrentWeather(
        city
      );
      if (!data || data.cod !== 200) {
        this.ui.showSection("notFound");
        return;
      }

      const forecastData: ForecastDay[] = await this.weatherService
        .getForecast(city)
        .then((res) => res.list); // map to ForecastDay[]

      this.ui.updateWeatherDisplay(data);
      this.ui.updateForecastDisplay(forecastData);
      this.ui.showSection("weatherInfo");

      const isFavorite = this.storageService.isFavorite(data.name);
      this.ui.updateFavButton(isFavorite);
    } catch (err) {
      console.error("Error fetching weather:", err);
      this.ui.showSection("notFound");
    } finally {
      this.ui.togglePreloader(false);
    }
  }

  private toggleFavorite(): void {
    const cityName = this.ui.getCityName();
    if (!cityName) return;

    const isNowFavorite = this.storageService.toggleFavorite(cityName);
    this.ui.updateFavButton(isNowFavorite);
  }
}
