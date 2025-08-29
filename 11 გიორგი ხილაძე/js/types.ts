// -----------------------------
// Types for Weather API
// -----------------------------
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface SysInfo {
  sunrise: number;
  sunset: number;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
}

export interface WindInfo {
  speed: number;
}

export interface CurrentWeatherResponse {
  name: string;
  weather: WeatherCondition[];
  sys: SysInfo;
  main: MainWeatherData;
  wind?: WindInfo;
  visibility?: number;
  [key: string]: unknown; // allow extra fields
}

export interface ForecastItem {
  dt: number;
  dt_txt?: string;
  main: MainWeatherData;
  weather: WeatherCondition[];
  [key: string]: unknown;
}

export interface ForecastData {
  list: ForecastItem[];
  [key: string]: unknown;
}

export interface ForecastItemWithDate extends ForecastItem {
  dateString: string;
}
