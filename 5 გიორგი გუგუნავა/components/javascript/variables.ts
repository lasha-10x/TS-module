// api/config.ts
// ==================================
// API KEY VARIABLE
// ==================================
export const apiKey: string = "c002eabec3dffadff47e3a2e8c28fb4f";

// ==================================
// GLOBAL VARIABLES IMPORTED FROM index.html
// ==================================
export const city = document.getElementById("city") as HTMLElement | null;
export const COUNTRY_CODE = document.getElementById("country_code") as HTMLElement | null;
export const temp = document.getElementById("temperature_degrees") as HTMLElement | null;
export const WEATHER_INFO = document.getElementById("temperature_info") as HTMLElement | null;
export const HUMIDITY_INDEX = document.getElementById("humidity_index") as HTMLElement | null;
export const WIND_SPEED_INDEX = document.getElementById("wind_speed_index") as HTMLElement | null;
export const PRESSURE_INDEX = document.getElementById("pressure_index") as HTMLElement | null;
export const FEELS_LIKE_INDEX = document.getElementById("feels_like_index") as HTMLElement | null;
export const VISIBILITY_INDEX = document.getElementById("visibility_index") as HTMLElement | null;
export const SUNRISE_TIME = document.getElementById("sunrise_time") as HTMLElement | null;
export const SUNSET_TIME = document.getElementById("sunset_time") as HTMLElement | null;
export const search = document.getElementById("search") as HTMLInputElement | null;
export const SEARCH_BTN = document.getElementById("seach_btn") as HTMLButtonElement | null;

export const FORECAST_CONTAINER = document.getElementsByClassName("forecast_container") as HTMLCollectionOf<HTMLElement>;
export const DAY_WEATHER = document.querySelectorAll<HTMLElement>("#day_weather");
export const MAX_TEMPERATURE = document.querySelectorAll<HTMLElement>("#day_time");
export const MIN_TEMPERATURE = document.querySelectorAll<HTMLElement>("#night_time");

// ==================================
// BACKGROUND VARIABLES IMPORTED FROM style.css
// ==================================
const getVar = (name: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const SUNNY_DAY: string = getVar("--sunny_day");
export const CLOUDY_DAY: string = getVar("--cloudy_day");
export const RAINY_DAY: string = getVar("--rainy_day");
export const SNOWY_DAY: string = getVar("--snowy_day");

export const MOON_NIGHT: string = getVar("--moon_night");
export const CLOUDY_NIGHT: string = getVar("--cloudy_night");
export const RAINY_NIGHT: string = getVar("--rainy_night");
export const SNOWY_NIGHT: string = getVar("--snowy_night");

// ==================================
// DAYS OBJECT FOR icon.ts
// ==================================
export const days: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ==================================
// CURRENT WEATHER DATA
// ==================================
export let currentWeatherData: any = null;
