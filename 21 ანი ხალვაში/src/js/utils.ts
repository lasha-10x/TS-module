// Define the type for weather content configuration
export interface WeatherContent {
  backgroundColor: string;
  textColor: string;
  icon: string;
  quote: string;
  character?: string;
}

// Export the configuration object
export const weatherContentConfig: Record<string, WeatherContent> = {
  rain: {
    backgroundColor:
      "linear-gradient(135deg, hsl(210 80% 80%), hsl(230 70% 70%))",
    textColor: "#1e3a8a",
    icon: "🌧️",
    quote: "Rain is just the sky crying — even it needs to let go sometimes.",
    character: "rainy-character.jpg",
  },
  sunny: {
    backgroundColor:
      "linear-gradient(135deg, hsl(45 100% 85%), hsl(35 100% 75%))",
    textColor: "#1e3a8a",
    icon: "🔆",
    quote:
      "When the sun returns, it doesn't ask what you've been through — it just shines.",
    character: "sunny-character.jpg",
  },
  Snow: {
    backgroundColor:
      "linear-gradient(135deg, hsl(280 60% 80%), hsl(200 100% 75%), hsl(160 60% 75%))",
    textColor: "#1e3a8a",
    icon: "❄️",
    quote: "Snow reminds us that stillness can sparkle too.",
    character: "snowy-character.jpg",
  },
  Drizzle: {
    backgroundColor:
      "linear-gradient(135deg, hsl(320 65% 85%), hsl(280 60% 80%))",
    textColor: "#f8fafc",
    icon: "🌦️",
    quote: "Even the softest drizzle can water something beautiful.",
  },
  Thunderstorm: {
    backgroundColor:
      "linear-gradient(135deg, hsl(320 65% 85%), hsl(280 60% 80%))",
    textColor: "#f8fafc",
    icon: "⛈️",
    quote:
      "Every thunderstorm teaches us how strong silence can feel afterward.",
    character: "stormy-character.jpg",
  },
  Clouds: {
    backgroundColor:
      "linear-gradient(135deg, hsl(195 100% 95%), hsl(220 100% 88%))",
    textColor: "#1e3a8a",
    icon: "☁️",
    quote: "Behind every cloud, the sky is still blue.",
    character: "cloudy-character.jpg",
  },
  Clear: {
    backgroundColor:
      "linear-gradient(135deg, hsl(45 100% 85%), hsl(35 100% 75%))",
    textColor: "#1e3a8a",
    icon: "🌤️",
    quote: "In the clearest skies, we see how far we’ve come.",
    character: "cloudy-character.jpg",
  },
};

// Fetch weekly weather data function
export const getWeeklyWeatherData = async (place: string) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=9b1eafa8504d3df1a475ec2a4e57743f`;
  const res = await fetch(apiUrl);
  const weeklyWeather = await res.json();

  const weeklyWeatherList = weeklyWeather.list;
  const weatherObj: Record<number, any> = {};

  weeklyWeatherList.forEach((item: any) => {
    const date = new Date(item.dt_txt);
    weatherObj[date.getDate()] = item;
  });

  return Object.values(weatherObj);
};
