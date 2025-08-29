export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}
export interface MainWeather {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}
export interface Wind {
    speed: number;
    deg: number;
}
export interface Coord {
    lon: number;
    lat: number;
}
export interface WeatherData {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: MainWeather;
    visibility: number;
    wind: Wind;
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}
export interface ForecastItem {
    dt: number;
    main: MainWeather;
    weather: Weather[];
    wind: Wind;
    visibility: number;
    dt_txt: string;
}
export interface ForecastData {
    cod: string;
    message: number;
    cnt: number;
    list: ForecastItem[];
    city: {
        id: number;
        name: string;
        coord: Coord;
        country: string;
        population: number;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
}
export declare function getCurrentWeather(city: string): Promise<WeatherData | null>;
export declare function getFiveDayForecast(city: string): Promise<ForecastData | null>;
//# sourceMappingURL=api.d.ts.map