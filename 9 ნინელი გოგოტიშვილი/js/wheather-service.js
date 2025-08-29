export class WeatherService {
    apiKey;
    baseUrl;
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.openweathermap.org/data/2.5/";
    }
    async fetch(endpoint, city) {
        const url = `${this.baseUrl}${endpoint}?q=${city}&appid=${this.apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint} for ${city}`);
        }
        return response.json();
    }
    getCurrentWeather(city) {
        return this.fetch("weather", city);
    }
    getForecast(city) {
        return this.fetch("forecast", city);
    }
    static celsius2fahrenheit(celsius) {
        if (isNaN(celsius))
            return "";
        return Math.round((celsius * 9) / 5 + 32);
    }
    static fahrenheit2celsius(fahrenheit) {
        if (isNaN(fahrenheit))
            return "";
        return Math.round(((fahrenheit - 32) * 5) / 9);
    }
    static getWeatherIcon(id) {
        if (id <= 232)
            return "thunderstorm.svg";
        if (id <= 321)
            return "drizzle.svg";
        if (id <= 531)
            return "rain.svg";
        if (id <= 622)
            return "snow.svg";
        if (id <= 781)
            return "atmosphere.svg";
        if (id === 800)
            return "clear.svg";
        return "clouds.svg";
    }
    static getFormattedDate() {
        return new Date().toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
        });
    }
}
//# sourceMappingURL=wheather-service.js.map