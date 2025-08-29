// weatherApi.ts

import { API_KEY } from "./config";

// -----------------------------
// Types
// -----------------------------
export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface Wind {
  speed: number;
  deg: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface WeatherData {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: MainWeather;
  visibility: number;
  wind: Wind;
  clouds: { all: number };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainWeather;
  weather: Weather[];
  wind: Wind;
  visibility: number;
  dt_txt: string;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coord;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// -----------------------------
// API Functions
// -----------------------------
export async function getCurrentWeather(
  city: string
): Promise<WeatherData | null> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric&lang=en`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status} - ${response.statusText}. Response: ${errorText}. URL: ${url}`
      );
    }
    const data: WeatherData = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting current weather:", error);
    return null;
  }
}

export async function getFiveDayForecast(
  city: string
): Promise<ForecastData | null> {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric&lang=en`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error getting forecast! Status: ${response.status} - ${response.statusText}. Response: ${errorText}. URL: ${url}`
      );
    }
    const data: ForecastData = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting 5-day forecast:", error);
    return null;
  }
}
