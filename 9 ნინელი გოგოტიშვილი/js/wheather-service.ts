export type WeatherData = {
  cod?: number;
  name: string;
  location: string;
  date: string;
  dateattr: string;
  current: {
    tempC: number;
    tempF: number;
    feelsLikeC: number;
    feelsLikeF: number;
    condition: string;
    icon: string;
    humidityTmp: number;
    windTmp: number;
    pressureTmp: number;
  };
  forecast: ForecastDay[];
  rain: {
    rain: boolean;
    chance: number;
  };
};

export type ForecastDay = {
  weekday: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
};

export class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.openweathermap.org/data/2.5/";
  }

  private async fetch(endpoint: string, city: string): Promise<any> {
    const url = `${this.baseUrl}${endpoint}?q=${city}&appid=${this.apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint} for ${city}`);
    }
    return response.json();
  }

  public getCurrentWeather(city: string): Promise<any> {
    return this.fetch("weather", city);
  }

  public getForecast(city: string): Promise<any> {
    return this.fetch("forecast", city);
  }

  public static celsius2fahrenheit(celsius: number): number | "" {
    if (isNaN(celsius)) return "";
    return Math.round((celsius * 9) / 5 + 32);
  }

  public static fahrenheit2celsius(fahrenheit: number): number | "" {
    if (isNaN(fahrenheit)) return "";
    return Math.round(((fahrenheit - 32) * 5) / 9);
  }

  public static getWeatherIcon(id: number): string {
    if (id <= 232) return "thunderstorm.svg";
    if (id <= 321) return "drizzle.svg";
    if (id <= 531) return "rain.svg";
    if (id <= 622) return "snow.svg";
    if (id <= 781) return "atmosphere.svg";
    if (id === 800) return "clear.svg";
    return "clouds.svg";
  }

  public static getFormattedDate(): string {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    });
  }
}
