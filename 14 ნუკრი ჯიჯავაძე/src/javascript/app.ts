// main.ts

import { WeatherAppUI } from "./WeatherAppUI";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize WeatherAppUI with API key
  const app: WeatherAppUI = new WeatherAppUI(
    "3894f2877ca26ffd99eeab17f4762833"
  );
});
