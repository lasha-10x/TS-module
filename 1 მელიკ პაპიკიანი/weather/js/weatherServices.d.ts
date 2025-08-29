interface CurrentWeather {
    tempC: number;
    tempF: number;
    feelsLikeC: number;
    feelsLikeF: number;
    condition: string;
    icon: string;
    humidityTmp: number;
    windTmp: number;
    pressureTmp: number;
}
interface ForecastDay {
    date: string;
    weekday: string;
    formattedDate: string;
    maxTemp: number;
    minTemp: number;
    condition: string;
    icon: string;
    avgtemp: number;
}
interface RainInfo {
    rain: number;
    chance: number;
}
interface WeatherData {
    location: string;
    date: string;
    dateattr: string;
    current: CurrentWeather;
    forecast: ForecastDay[];
    rain: RainInfo;
}
interface WeatherAppSettings {
    city?: string;
    tempScale?: "C" | "F";
    theme?: string;
}
declare class WeatherApp {
    private _apiKey;
    private _city;
    private _days;
    private _base;
    private _getResource;
    getWeather: (city?: string) => Promise<WeatherData | null>;
    getLocation: (city?: string) => Promise<string[] | null>;
    private _loc;
    private _weatherItems;
    humidityStatus: (value: number) => string;
    windStatus: (kph: number) => string;
    pressureStatus: (hPa: number) => string;
    turbineSpeedCalc: (kph: number) => number;
    pressureSpeedCalc: (hPa: number) => number;
    humiditySpeedCalc: (val: number) => number;
    saveSettings(city: string, tempScale: "C" | "F"): void;
    loadSettings(): WeatherAppSettings | null;
    saveTheme(mode: string): void;
    loadTheme(): {
        theme?: string;
    } | null;
    removeSettings(): void;
    popularCities(render: HTMLElement): void;
}
export { WeatherApp };
export type { WeatherData, ForecastDay };
//# sourceMappingURL=weatherServices.d.ts.map