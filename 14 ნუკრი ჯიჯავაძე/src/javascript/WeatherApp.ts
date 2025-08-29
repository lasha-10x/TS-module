// weatherApp.ts

interface Coord {
  lat: number;
  lon: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

interface Wind {
  speed: number;
}

interface Sys {
  country: string;
  sunrise?: number;
  sunset?: number;
}

interface CurrentData {
  wind: Wind;
  visibility: number;
  pop?: number | null;
}

interface OneCallData {
  current?: {
    wind: Wind;
    pop?: number | null;
  };
  hourly?: any[];
  daily?: any[];
}

interface WeatherAPIResponse {
  current: CurrentData;
  coord: Coord;
  sys: Sys;
  name: string;
  main: Main;
  weather: Weather[];
  oneCallData: OneCallData;
}

interface CachedData {
  oneCallData?: OneCallData;
  hourly?: any[];
  weekly?: any[];
}

export class WeatherApp {
  apiKey: string;
  cachedData: CachedData;
  currentCoords: Coord | null;
  elements: {
    searchForm: HTMLFormElement;
    searchInput: HTMLInputElement;
    weatherSection: HTMLElement;
    currentLocation: HTMLElement;
    lastUpdated: HTMLElement;
    buttons: NodeListOf<HTMLButtonElement>;
    forecastContent: HTMLElement;
    refreshBtn: HTMLElement;
  };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.cachedData = {};
    this.currentCoords = null;
    this.elements = {
      searchForm: document.querySelector('.search-form') as HTMLFormElement,
      searchInput: document.querySelector('#city-search') as HTMLInputElement,
      weatherSection: document.querySelector('.weather-section') as HTMLElement,
      currentLocation: document.querySelector('.current-location') as HTMLElement,
      lastUpdated: document.getElementById('last-updated') as HTMLElement,
      buttons: document.querySelectorAll('.forecast-control__btn') as NodeListOf<HTMLButtonElement>,
      forecastContent: document.querySelector('.forecast-content') as HTMLElement,
      refreshBtn: document.querySelector('.refresh-btn') as HTMLElement,
    };

    this.init();
    this.renderPlaceholder();
    this.chooseCategory();
  }

  init() {
    this.elements.searchForm.addEventListener('submit', (e) => this.handleSearch(e));
    this.elements.refreshBtn.addEventListener('click', () => this.handleRefresh());
    this.initialLoad();
  }

  async initialLoad() {
    const defaultCity = "Batumi";
    if (defaultCity) {
      this.elements.searchInput.value = defaultCity;
      await this.handleSearch(new Event('submit', { cancelable: true }));
    }
  }

  async handleSearch(e: Event) {
    e.preventDefault();
    const city = this.elements.searchInput.value.trim();
    if (!city) return;

    try {
      this.cachedData = {};
      const { current, coord, sys, name, main, weather, oneCallData } = await this.fetchWeather(city);
      this.currentCoords = coord;

      await this.animateTransition(() => this.renderWeather({ 
        weather,
        main,
        wind: current.wind,
        visibility: current.visibility,
        sys,
        name
      }));

      this.elements.currentLocation.textContent = `${name}, ${sys.country}`;
      this.updateLastUpdated();

      this.elements.buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      const todayButton = Array.from(this.elements.buttons).find(btn => btn.textContent?.trim() === 'Today');
      if (todayButton) {
        todayButton.classList.add('active');
        todayButton.setAttribute('aria-pressed', 'true');
      }

      this.loadCategoryData('Today', oneCallData);
    } catch (err: any) {
      console.error("Error in handleSearch:", err);
      alert(err.message || 'City not found!');
      await this.animateTransition(() => this.renderPlaceholder());
      this.elements.currentLocation.textContent = '';
      this.elements.lastUpdated.textContent = '';
      this.elements.forecastContent.innerHTML = '';
    }
  }

  async handleRefresh() {
    const currentCity = this.elements.searchInput.value.trim();
    if (!currentCity) {
      alert("Please search for a city first.");
      return;
    }
    this.cachedData = {};
    await this.handleSearch(new Event('submit', { cancelable: true }));
  }

  updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.elements.lastUpdated.textContent = timeString;
    this.elements.lastUpdated.setAttribute('datetime', now.toISOString());
  }

  async fetchWeather(city: string): Promise<WeatherAPIResponse> {
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`
    );
    if (!currentRes.ok) throw new Error('City not found');
    const currentData = await currentRes.json();
    const { lat, lon } = currentData.coord;

    const oneCallRes = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${this.apiKey}&units=metric`
    );
    if (!oneCallRes.ok) throw new Error('Failed to fetch detailed forecast');
    const oneCallData = await oneCallRes.json();

    return {
      current: {
        wind: currentData.wind,
        visibility: currentData.visibility,
        pop: oneCallData.hourly?.[0]?.pop ?? null
      },
      coord: currentData.coord,
      sys: currentData.sys,
      name: currentData.name,
      main: currentData.main,
      weather: currentData.weather,
      oneCallData
    };
  }

  async fetchHourlyForecast(lat: number, lon: number): Promise<any[]> {
    if (this.cachedData.oneCallData?.hourly) return this.cachedData.oneCallData.hourly;

    const res = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,daily,alerts&appid=${this.apiKey}&units=metric`
    );
    if (!res.ok) throw new Error('Failed to fetch hourly forecast');
    const data = await res.json();
    this.cachedData.hourly = data.hourly;
    return data.hourly;
  }

  async fetchWeeklyForecast(lat: number, lon: number): Promise<any[]> {
    if (this.cachedData.oneCallData?.daily) return this.cachedData.oneCallData.daily;

    const res = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${this.apiKey}&units=metric`
    );
    if (!res.ok) throw new Error('Failed to fetch weekly forecast');
    const data = await res.json();
    this.cachedData.weekly = data.daily;
    return data.daily;
  }

  // These are placeholder methods to be implemented in your WeatherAppUI
  renderPlaceholder(): void {}
  renderWeather(data: any): void {}
  animateTransition(renderFn: () => void): Promise<void> { return Promise.resolve(); }
  chooseCategory(): void {}
  loadCategoryData(category: string, oneCallData?: OneCallData | null): void {}
}
