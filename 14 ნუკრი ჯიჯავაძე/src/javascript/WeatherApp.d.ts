interface Coord {
    lat: number;
    lon: number;
}
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
    country: string;
    sunrise?: number;
    sunset?: number;
}
interface CurrentData {
    wind: Wind;
    visibility: number;
    pop?: number | null;
}
interface OneCallData {
    current?: {
        wind: Wind;
        pop?: number | null;
    };
    hourly?: any[];
    daily?: any[];
}
interface WeatherAPIResponse {
    current: CurrentData;
    coord: Coord;
    sys: Sys;
    name: string;
    main: Main;
    weather: Weather[];
    oneCallData: OneCallData;
}
interface CachedData {
    oneCallData?: OneCallData;
    hourly?: any[];
    weekly?: any[];
}
export declare class WeatherApp {
    apiKey: string;
    cachedData: CachedData;
    currentCoords: Coord | null;
    elements: {
        searchForm: HTMLFormElement;
        searchInput: HTMLInputElement;
        weatherSection: HTMLElement;
        currentLocation: HTMLElement;
        lastUpdated: HTMLElement;
        buttons: NodeListOf<HTMLButtonElement>;
        forecastContent: HTMLElement;
        refreshBtn: HTMLElement;
    };
    constructor(apiKey: string);
    init(): void;
    initialLoad(): Promise<void>;
    handleSearch(e: Event): Promise<void>;
    handleRefresh(): Promise<void>;
    updateLastUpdated(): void;
    fetchWeather(city: string): Promise<WeatherAPIResponse>;
    fetchHourlyForecast(lat: number, lon: number): Promise<any[]>;
    fetchWeeklyForecast(lat: number, lon: number): Promise<any[]>;
    renderPlaceholder(): void;
    renderWeather(data: any): void;
    animateTransition(renderFn: () => void): Promise<void>;
    chooseCategory(): void;
    loadCategoryData(category: string, oneCallData?: OneCallData | null): void;
}
export {};
//# sourceMappingURL=WeatherApp.d.ts.map