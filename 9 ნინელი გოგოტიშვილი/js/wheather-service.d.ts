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
export declare class WeatherService {
    private apiKey;
    private baseUrl;
    constructor(apiKey: string);
    private fetch;
    getCurrentWeather(city: string): Promise<any>;
    getForecast(city: string): Promise<any>;
    static celsius2fahrenheit(celsius: number): number | "";
    static fahrenheit2celsius(fahrenheit: number): number | "";
    static getWeatherIcon(id: number): string;
    static getFormattedDate(): string;
}
//# sourceMappingURL=wheather-service.d.ts.map