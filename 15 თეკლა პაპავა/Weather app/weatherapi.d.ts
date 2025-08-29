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
export declare function fetchWeather(city: string): Promise<WeatherData>;
//# sourceMappingURL=weatherapi.d.ts.map