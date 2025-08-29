// api/config.ts
// ==================================
// API KEY VARIABLE
// ==================================
export const apiKey = "c002eabec3dffadff47e3a2e8c28fb4f";
// ==================================
// GLOBAL VARIABLES IMPORTED FROM index.html
// ==================================
export const city = document.getElementById("city");
export const COUNTRY_CODE = document.getElementById("country_code");
export const temp = document.getElementById("temperature_degrees");
export const WEATHER_INFO = document.getElementById("temperature_info");
export const HUMIDITY_INDEX = document.getElementById("humidity_index");
export const WIND_SPEED_INDEX = document.getElementById("wind_speed_index");
export const PRESSURE_INDEX = document.getElementById("pressure_index");
export const FEELS_LIKE_INDEX = document.getElementById("feels_like_index");
export const VISIBILITY_INDEX = document.getElementById("visibility_index");
export const SUNRISE_TIME = document.getElementById("sunrise_time");
export const SUNSET_TIME = document.getElementById("sunset_time");
export const search = document.getElementById("search");
export const SEARCH_BTN = document.getElementById("seach_btn");
export const FORECAST_CONTAINER = document.getElementsByClassName("forecast_container");
export const DAY_WEATHER = document.querySelectorAll("#day_weather");
export const MAX_TEMPERATURE = document.querySelectorAll("#day_time");
export const MIN_TEMPERATURE = document.querySelectorAll("#night_time");
// ==================================
// BACKGROUND VARIABLES IMPORTED FROM style.css
// ==================================
const getVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
export const SUNNY_DAY = getVar("--sunny_day");
export const CLOUDY_DAY = getVar("--cloudy_day");
export const RAINY_DAY = getVar("--rainy_day");
export const SNOWY_DAY = getVar("--snowy_day");
export const MOON_NIGHT = getVar("--moon_night");
export const CLOUDY_NIGHT = getVar("--cloudy_night");
export const RAINY_NIGHT = getVar("--rainy_night");
export const SNOWY_NIGHT = getVar("--snowy_night");
// ==================================
// DAYS OBJECT FOR icon.ts
// ==================================
export const days = [
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
export let currentWeatherData = null;
//# sourceMappingURL=variables.js.map