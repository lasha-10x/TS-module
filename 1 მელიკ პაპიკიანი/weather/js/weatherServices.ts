interface CurrentWeather {
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  condition: string;
  icon: string;
  humidityTmp: number;
  windTmp: number;
  pressureTmp: number;
}

interface ForecastDay {
  date: string;
  weekday: string;
  formattedDate: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  icon: string;
  avgtemp: number;
}

interface RainInfo {
  rain: number;
  chance: number;
}

interface WeatherData {
  location: string;
  date: string;
  dateattr: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
  rain: RainInfo;
}

interface LocationData {
  name: string;
}

interface WeatherAppSettings {
  city?: string;
  tempScale?: "C" | "F";
  theme?: string;
}

class WeatherApp {
  private _apiKey = "3f9cf34620e14463966140028250507";
  private _city = "Batumi";
  private _days = 7;
  private _base = "https://api.weatherapi.com/v1/";

  private _getResource = async (url: string): Promise<any | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error fetching data");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("An error occurred:", error);
      return null;
    }
  };

  public getWeather = async (
    city: string = this._city
  ): Promise<WeatherData | null> => {
    const res = await this._getResource(
      `${this._base}forecast.json?key=${this._apiKey}&q=${city}&days=${this._days}&aqi=no&alerts=no`
    );
    return res ? this._weatherItems(res) : null;
  };

  public getLocation = async (
    city: string = this._city
  ): Promise<string[] | null> => {
    const loc = await this._getResource(
      `${this._base}search.json?key=${this._apiKey}&q=${city}`
    );
    return loc ? this._loc(loc) : null;
  };

  private _loc = (items: LocationData[]): string[] => {
    return items.map((item) => item.name);
  };

  private _weatherItems = (item: any): WeatherData => {
    return {
      location: item.location.name,
      date: new Date(item.location.localtime).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      dateattr: item.location.localtime.split(" ")[0],
      current: {
        tempC: item.current.temp_c,
        tempF: item.current.temp_f,
        feelsLikeC: item.current.feelslike_c,
        feelsLikeF: item.current.feelslike_f,
        condition: item.current.condition.text,
        icon: item.current.condition.icon,
        humidityTmp: item.current.humidity,
        windTmp: item.current.wind_kph,
        pressureTmp: item.current.pressure_mb,
      },
      forecast: item.forecast.forecastday.map(
        (day: any): ForecastDay => ({
          date: day.date,
          weekday: new Date(day.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          formattedDate: new Date(day.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          maxTemp: day.day.maxtemp_c,
          minTemp: day.day.mintemp_c,
          condition: day.day.condition.text,
          icon: day.day.condition.icon,
          avgtemp: day.day.avgtemp_c,
        })
      ),
      rain: {
        rain: item.forecast.forecastday[0].day.daily_will_it_rain,
        chance: item.forecast.forecastday[0].day.daily_chance_of_rain,
      },
    };
  };

  public humidityStatus = (value: number): string => {
    switch (true) {
      case value <= 30:
        return "Dry";
      case value <= 60:
        return "Comfortable";
      case value <= 80:
        return "Humid";
      default:
        return "Very Humid";
    }
  };

  public windStatus = (kph: number): string => {
    switch (true) {
      case kph <= 5:
        return "Calm";
      case kph <= 19:
        return "Moderate";
      case kph <= 38:
        return "Fresh";
      case kph <= 61:
        return "Strong";
      case kph <= 88:
        return "Gale";
      default:
        return "Storm";
    }
  };

  public pressureStatus = (hPa: number): string => {
    switch (true) {
      case hPa < 1000:
        return "Low";
      case hPa <= 1020:
        return "Normal";
      default:
        return "High";
    }
  };

  public turbineSpeedCalc = (kph: number): number => {
    if (kph <= 0.2) return 80;
    if (kph <= 1) return 30;
    if (kph <= 2) return 10;
    if (kph <= 3) return 8;
    if (kph <= 4) return 6;
    if (kph <= 5) return 5;
    if (kph <= 6) return 4;
    if (kph <= 7) return 3;
    if (kph <= 8) return 2;
    if (kph <= 9) return 1.8;
    if (kph <= 10) return 1.5;
    if (kph <= 13) return 1.3;
    if (kph <= 15) return 1.1;
    if (kph <= 20) return 1;
    if (kph <= 25) return 0.9;
    if (kph <= 30) return 0.8;
    if (kph <= 40) return 0.75;
    if (kph <= 50) return 0.7;
    if (kph <= 60) return 0.65;
    if (kph <= 70) return 0.6;
    if (kph <= 80) return 0.55;
    if (kph <= 90) return 0.5;
    if (kph <= 100) return 0.45;
    return 0.4;
  };

  public pressureSpeedCalc = (hPa: number): number => {
    if (hPa < 980) return -90;
    if (hPa > 1050) return 90;
    const minPressure = 980;
    const maxPressure = 1050;
    const minAngle = -68;
    const maxAngle = 68;
    const ratio = (hPa - minPressure) / (maxPressure - minPressure);
    return minAngle + ratio * (maxAngle - minAngle);
  };

  public humiditySpeedCalc = (val: number): number => {
    const minHumidity = 1;
    const maxHumidity = 100;
    const minAngle = -89;
    const maxAngle = 89;
    const ratio = (val - minHumidity) / (maxHumidity - minHumidity);
    return minAngle + ratio * (maxAngle - minAngle);
  };

  public saveSettings(city: string, tempScale: "C" | "F") {
    const currentSettings: WeatherAppSettings = JSON.parse(
      localStorage.getItem("weatherAppSettings") || "{}"
    );
    currentSettings.city = city;
    currentSettings.tempScale = tempScale;
    localStorage.setItem("weatherAppSettings", JSON.stringify(currentSettings));
  }

  public loadSettings(): WeatherAppSettings | null {
    const saved = localStorage.getItem("weatherAppSettings");
    if (!saved) return null;
    return JSON.parse(saved) as WeatherAppSettings;
  }

  public saveTheme(mode: string) {
    const currentSettings: WeatherAppSettings = JSON.parse(
      localStorage.getItem("weatherAppSettings") || "{}"
    );
    currentSettings.theme = mode;
    localStorage.setItem("weatherAppSettings", JSON.stringify(currentSettings));
  }

  public loadTheme(): { theme?: string } | null {
    const saved = localStorage.getItem("weatherAppSettings");
    if (!saved) return null;
    return { theme: JSON.parse(saved).theme };
  }

  public removeSettings() {
    const saved = localStorage.getItem("weatherAppSettings");
    if (!saved) return;
    const settings = JSON.parse(saved);
    delete settings.city;
    delete settings.tempScale;
    localStorage.setItem("weatherAppSettings", JSON.stringify(settings));
  }

  public popularCities(render: HTMLElement) {
    const cities = [
      "Batumi",
      "Ajara",
      "Tbilisi",
      "Kutaisi",
      "Rustavi",
      "Zugdidi",
      "Poti",
      "Gori",
      "Senaki",
      "Bakuriani",
      "Borjomi",
      "Kvareli",
      "Martvili",
      "Tskaltubo",
      "Dmanisi",
      "Mestia",
      "Tetri Tsqaro",
      "Ambrolauri",
      "Gudauri",
      "Dusheti",
      "Tokyo",
      "New York",
      "London",
      "Paris",
      "Istanbul",
      "Dubai",
      "Hong Kong",
      "Bangkok",
      "Singapore",
      "Rome",
      "Erevan",
      "Barcelona",
      "Seoul",
      "Los Angeles",
      "Moscow",
      "Beijing",
      "Berlin",
      "Mumbai",
      "San Francisco",
      "Shanghai",
      "Sydney",
      "Georgia",
      "Amsterdam",
      "Mexico City",
      "Buenos Aires",
      "Cape Town",
      "Vancouver",
      "Toronto",
      "Madrid",
      "Lisbon",
      "Prague",
    ];

    render.innerHTML = cities
      .map((item) => `<span role="button">${item}</span>`)
      .join("");
  }
}

export { WeatherApp };
export type { WeatherData, ForecastDay };
