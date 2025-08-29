export interface GeoLocation {
    name: string;
    lat: number;
    lon: number;
    country: string;
}
export interface WeatherMain {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
    pressure: number;
}
export interface WeatherInfo {
    main: string;
    description: string;
    icon: string;
}
export interface WeatherListItem {
    dt: number;
    dt_txt: string;
    main: WeatherMain;
    weather: WeatherInfo[];
    wind: {
        speed: number;
    };
}
export interface WeatherData {
    list: WeatherListItem[];
}
export interface WeatherApiResult {
    weather: WeatherData;
    locationName: string;
}
//# sourceMappingURL=script.d.ts.map