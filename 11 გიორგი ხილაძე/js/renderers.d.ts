interface WeatherMain {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
}
interface WeatherWind {
    speed: number;
}
interface WeatherSys {
    sunrise: number;
    sunset: number;
}
interface WeatherDescription {
    main: string;
    description: string;
    icon: string;
}
export interface WeatherData {
    name: string;
    main: WeatherMain;
    wind: WeatherWind;
    visibility: number;
    sys: WeatherSys;
    weather: WeatherDescription[];
}
export interface ForecastItem {
    dt: number;
    main: {
        temp: number;
    };
    weather: WeatherDescription[];
    dateString: string;
}
export declare function initRenderersElements(): void;
export declare function updateBackgroundVideo(weatherMainCondition: string): void;
export declare function displayCurrentWeather(weatherData: WeatherData): void;
export declare function displayFiveDayForecast(processedForecastData: ForecastItem[], currentSunriseUnix?: number, currentSunsetUnix?: number): void;
export {};
//# sourceMappingURL=renderers.d.ts.map