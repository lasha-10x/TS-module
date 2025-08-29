interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}
interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}
interface Wind {
    speed: number;
}
interface Sys {
    sunrise: number;
    sunset: number;
}
interface OneCallData {
    sys: Sys;
    main: Main;
    wind: Wind;
    weather: Weather[];
    visibility: number;
    current?: {
        wind: {
            speed: number;
        };
        pop?: number;
    };
    hourly?: any[];
    daily?: any[];
}
interface WeatherTemplateData {
    temp: number | string;
    desc: string;
    icon: string;
    feels: number | string;
    high: number | string;
    low: number | string;
    wind: number | string;
    humidity: number | string;
    visibility: number | string;
    pressure: number | string;
}
declare class WeatherApp {
    constructor(apiKey: string);
    elements: {
        weatherSection: HTMLElement;
        forecastContent: HTMLElement;
        currentLocation: HTMLElement;
        lastUpdated: HTMLElement;
        searchInput: HTMLInputElement;
        buttons: NodeListOf<HTMLButtonElement>;
    };
    currentCoords?: {
        lat: number;
        lon: number;
    };
    fetchWeather(city: string): Promise<OneCallData>;
    fetchHourlyForecast(lat: number, lon: number): Promise<any[]>;
    fetchWeeklyForecast(lat: number, lon: number): Promise<any[]>;
}
export declare class WeatherAppUI extends WeatherApp {
    constructor(apiKey: string);
    renderWeather({ weather: [w], main, wind, visibility }: OneCallData): void;
    renderPlaceholder(): void;
    renderTemplate(data: WeatherTemplateData): void;
    renderDetail(icon: string, label: string, value: string): string;
    loadSunriseSunset(sunrise: number, sunset: number): string;
    loadPrecipitation(humidity: number, pop: number | null): string;
    renderHourlyForecast(hourlyData: any[]): string;
    renderWeeklyForecast(weeklyData: any[]): string;
    loadCategoryData(category: string, oneCallData?: OneCallData | null): Promise<void>;
    chooseCategory(): void;
    animateTransition(renderFn: () => void): Promise<void>;
    loadWindAndPressure(wind: number, pressure: number): string;
}
export {};
//# sourceMappingURL=WeatherAppUI.d.ts.map