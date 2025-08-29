export interface CityData {
    city: {
        name: string;
        country: string;
        sunrise: number;
        sunset: number;
    };
    list: Array<{
        main: {
            temp: number;
            feels_like: number;
            humidity: number;
            pressure: number;
        };
        wind: {
            speed: number;
        };
        visibility: number;
        weather: Array<{
            main: string;
        }>;
    }>;
}
export declare const KelvinToCelsius: (k: number) => string;
export declare const KelvinToFahrenheit: (k: number) => string;
export declare const calculateVisibility: (m: number) => string;
export declare const getWeatherIcon: (condition: string) => string;
declare global {
    interface Window {
        showLoader?: () => void;
        hideLoader?: () => void;
    }
}
//# sourceMappingURL=app.d.ts.map