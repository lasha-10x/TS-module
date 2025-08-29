type WeatherCode = 0 | 1 | 2 | 3 | 45 | 48 | 51 | 53 | 55 | 56 | 57 | 61 | 63 | 65 | 66 | 67 | 71 | 73 | 75 | 77 | 80 | 81 | 82 | 85 | 86 | 95 | 96 | 99;
interface CurrentWeather {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: WeatherCode;
    is_day: number;
    time: string;
}
interface ForecastData {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: WeatherCode[];
}
declare global {
    interface Window {
        _lastWeather?: CurrentWeather;
        _lastCity?: string;
        _lastForecast?: ForecastData;
    }
}
export {};
//# sourceMappingURL=main.d.ts.map