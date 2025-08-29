export interface WeatherContent {
    backgroundColor: string;
    textColor: string;
    icon: string;
    quote: string;
    character?: string;
}
export declare const weatherContentConfig: Record<string, WeatherContent>;
export declare const getWeeklyWeatherData: (place: string) => Promise<any[]>;
//# sourceMappingURL=utils.d.ts.map