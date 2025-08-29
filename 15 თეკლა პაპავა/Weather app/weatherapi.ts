const API_KEY = "53eef5b337b36394bc6a53a5a33632b8";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

function degToCompass(num: number): string | undefined {
  const val = Math.floor(num / 22.5 + 0.5);
  const arr = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return arr[val % 16];
}

// Types for OpenWeather API response
interface WeatherCondition {
  main: string;
  icon: string;
}

interface CurrentWeatherResponse {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: WeatherCondition[];
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: WeatherCondition[];
}

interface ForecastResponse {
  list: ForecastItem[];
}

export interface HourlyForecast {
  hour: string;
  temp: number;
  icon: string;
  condition: string;
}

export interface DailyForecast {
  day: string;
  temp: number;
  icon: string;
  condition: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string | undefined;
  pressure: number;
  feelsLike: number;
  sunrise: string;
  sunset: string;
  icon: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  // Fetch current weather
  const currentRes = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`
  );
  if (!currentRes.ok) throw new Error("City not found");
  const current: CurrentWeatherResponse = await currentRes.json();

  // Fetch forecast
  const forecastRes = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(
      city
    )}&appid=${API_KEY}&units=metric`
  );
  if (!forecastRes.ok) throw new Error("Forecast not found");
  const forecast: ForecastResponse = await forecastRes.json();

  // Prepare hourly (next 8 intervals for ~24h)
  const hourly: HourlyForecast[] = forecast.list.slice(0, 8).map((item) => ({
    hour: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temp: Math.round(item.main.temp),
    icon: `https://openweathermap.org/img/wn/${item.weather[0]!.icon}@2x.png`,
    condition: item.weather[0]!.main,
  }));

  // Prepare daily (up to 5 days, closest to noon)
  const daysMap: Record<
    string,
    {
      hour: number;
      temp: number;
      icon: string;
      condition: string;
      day: string;
    }[]
  > = {};

  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString();
    const hour = date.getHours();
    if (!daysMap[dayKey]) daysMap[dayKey] = [];
    daysMap[dayKey].push({
      hour,
      temp: Math.round(item.main.temp),
      icon: `https://openweathermap.org/img/wn/${item.weather[0]!.icon}@2x.png`,
      condition: item.weather[0]!.main,
      day: date.toLocaleDateString([], { weekday: "short" }),
    });
  });

  const daily: DailyForecast[] = Object.values(daysMap)
    .slice(0, 5)
    .map((dayArr) => {
      const closest = dayArr.reduce((prev, curr) =>
        Math.abs(curr.hour - 12) < Math.abs(prev.hour - 12) ? curr : prev
      );
      return {
        day: closest.day,
        temp: closest.temp,
        icon: closest.icon,
        condition: closest.condition,
      };
    });

  // Sunrise/sunset
  const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    city: current.name,
    temperature: Math.round(current.main.temp),
    condition: current.weather[0]!.main,
    humidity: current.main.humidity,
    windSpeed: Math.round(current.wind.speed),
    windDirection: degToCompass(current.wind.deg),
    pressure: current.main.pressure,
    feelsLike: Math.round(current.main.feels_like),
    sunrise,
    sunset,
    icon: `https://openweathermap.org/img/wn/${
      current.weather[0]!.icon
    }@2x.png`,
    hourly,
    daily,
  };
}
