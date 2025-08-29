// dataUtils.ts
// -----------------------------
// Map Weather to Background Video
// -----------------------------
export function mapWeatherConditionToVideo(weatherMainCondition) {
    let videoFileName = "sunClouds.mp4";
    const condition = weatherMainCondition.toLowerCase();
    switch (condition) {
        case "clear":
            videoFileName = "sunny.mp4";
            break;
        case "clouds":
            videoFileName = "cloudy.mp4";
            break;
        case "rain":
        case "drizzle":
            videoFileName = "rain.mp4";
            break;
        case "thunderstorm":
            videoFileName = "thunder.mp4";
            break;
        case "snow":
            videoFileName = "snowfall.mp4";
            break;
        case "mist":
        case "smoke":
        case "haze":
        case "fog":
        case "sand":
        case "dust":
        case "ash":
        case "squall":
        case "tornado":
        case "atmosphere":
            videoFileName = "cloudy.mp4";
            break;
        default:
            console.warn(`No specific video for weather condition: ${weatherMainCondition}. Using default.`);
            break;
    }
    return `./assets/bg/${videoFileName}`;
}
// -----------------------------
// Map OWM icon codes to local icons
// -----------------------------
export function getWeatherIconUrl(owmIconCode) {
    const basePath = "./assets/week/";
    const iconMap = {
        "01d": "sun.svg",
        "01n": "moonStars.svg",
        "02d": "cloudySun.svg",
        "02n": "moonStars.svg",
        "03d": "cloudySun.svg",
        "03n": "moonStars.svg",
        "04d": "cloudySun.svg",
        "04n": "cloudySun.svg",
        "09d": "rainCloud.svg",
        "09n": "rainCloud.svg",
        "10d": "rainCloud.svg",
        "10n": "rainCloud.svg",
        "11d": "thunder.svg",
        "11n": "thunder.svg",
        "13d": "snowCloud.svg",
        "13n": "snowCloud.svg",
        "50d": "windyCloud.svg",
        "50n": "windyCloud.svg",
    };
    return basePath + (iconMap[owmIconCode] || "default_weather_icon.svg");
}
// -----------------------------
// Process forecast data into daily forecasts
// -----------------------------
export function processForecastData(forecastData) {
    if (!forecastData || !forecastData.list) {
        return [];
    }
    const dailyForecasts = {};
    forecastData.list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
        const hour = date.getHours();
        // Always attach a dateString so type is satisfied
        const itemWithDateString = {
            ...item,
            dateString,
        };
        if (!dailyForecasts[dateString] || (hour >= 11 && hour <= 13)) {
            dailyForecasts[dateString] = itemWithDateString;
        }
    });
    const sortedDailyForecasts = Object.values(dailyForecasts).sort((a, b) => a.dt - b.dt);
    // Extend to 7 days
    // Inside processForecastData after sorting
    if (sortedDailyForecasts.length >= 3) {
        // Explicitly construct ForecastItemWithDate objects
        const day3Forecast = {
            ...sortedDailyForecasts[2],
            dt: Math.floor(new Date(sortedDailyForecasts[sortedDailyForecasts.length - 1].dt * 1000).getTime() / 1000),
            dateString: new Date(new Date(sortedDailyForecasts[sortedDailyForecasts.length - 1].dt * 1000).getTime() +
                24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
            }),
        };
        const day2Forecast = {
            ...sortedDailyForecasts[1],
            dt: Math.floor(new Date(sortedDailyForecasts[sortedDailyForecasts.length - 1].dt * 1000).getTime() /
                1000 +
                2 * 24 * 60 * 60 * 1000),
            dateString: new Date(new Date(sortedDailyForecasts[sortedDailyForecasts.length - 1].dt * 1000).getTime() +
                2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
            }),
        };
        sortedDailyForecasts.push(day3Forecast, day2Forecast);
    }
    return sortedDailyForecasts.slice(0, 7);
}
// -----------------------------
// Generate randomized time near a base time
// -----------------------------
export function getRandomizedTime(baseDate, minOffset, maxOffset) {
    if (!baseDate)
        return "--:--";
    const randomOffset = Math.floor(Math.random() * (maxOffset - minOffset + 1)) + minOffset;
    const sign = Math.random() < 0.5 ? 1 : -1;
    const newDate = new Date(baseDate.getTime() + sign * randomOffset * 60 * 1000);
    return newDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}
//# sourceMappingURL=dataUtils.js.map