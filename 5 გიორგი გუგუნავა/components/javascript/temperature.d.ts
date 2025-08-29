declare let isFahrenheit: boolean;
/**
 * Toggles between Celsius and Fahrenheit display modes.
 * @param currentWeatherData - Weather data object used to re-render UI
 */
declare const temperatureMode: (currentWeatherData: any) => void;
declare global {
    interface Window {
        renderTodayWeather: (data: any) => void;
        renderForcast: (data: any) => void;
    }
}
export { temperatureMode, isFahrenheit };
//# sourceMappingURL=temperature.d.ts.map