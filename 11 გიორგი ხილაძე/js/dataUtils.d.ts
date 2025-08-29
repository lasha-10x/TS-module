export interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}
export interface ForecastItem {
    dt: number;
    dt_txt?: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        humidity: number;
    };
    weather: WeatherCondition[];
    [key: string]: unknown;
}
export interface ForecastData {
    list: ForecastItem[];
    [key: string]: unknown;
}
export interface ForecastItemWithDate extends ForecastItem {
    dateString: string;
}
export declare function mapWeatherConditionToVideo(weatherMainCondition: string): string;
export declare function getWeatherIconUrl(owmIconCode: string): string;
export declare function processForecastData(forecastData: ForecastData | null): ForecastItemWithDate[];
export declare function getRandomizedTime(baseDate: Date | null, minOffset: number, maxOffset: number): string;
//# sourceMappingURL=dataUtils.d.ts.map