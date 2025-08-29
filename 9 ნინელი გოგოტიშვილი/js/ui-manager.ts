import { WeatherService } from './wheather-service.js';

export class UI {
  mainContainer: HTMLElement | null;
  sectionsContainer: HTMLElement | null;
  cityInput: HTMLInputElement | null;
  searchBtn: HTMLButtonElement | null;
  notFoundSection: HTMLElement | null;
  searchCitySection: HTMLElement | null;
  weatherInfoSection: HTMLElement | null;
  countryTxt: HTMLElement | null;
  tempTxt: HTMLElement | null;
  conditionTxt: HTMLElement | null;
  humidityValueTxt: HTMLElement | null;
  windValueTxt: HTMLElement | null;
  weatherSummaryImg: HTMLImageElement | null;
  currentDateTxt: HTMLElement | null;
  forecastItemsContainer: HTMLElement | null;
  favBtn: HTMLElement | null;
  cityNameEl: HTMLElement | null;
  citySelEl: HTMLElement | null;
  preloaderEl: HTMLElement | null;
  unitToggleBtn: HTMLElement | null;

  constructor() {
    this.mainContainer = document.querySelector('#main-container');
    this.sectionsContainer = document.querySelector('#sections-container');
    this.cityInput = document.querySelector('.city-input');
    this.searchBtn = document.querySelector('.search-btn');
    this.notFoundSection = document.querySelector('.not-found');
    this.searchCitySection = document.querySelector('.search-city');
    this.weatherInfoSection = document.querySelector('.weather-info');
    this.countryTxt = document.querySelector('.country-txt');
    this.tempTxt = document.querySelector('.temp-txt');
    this.conditionTxt = document.querySelector('.condition-txt');
    this.humidityValueTxt = document.querySelector('.humidity-value-txt');
    this.windValueTxt = document.querySelector('.wind-value-txt');
    this.weatherSummaryImg = document.querySelector('.weather-summary-img');
    this.currentDateTxt = document.querySelector('.current-date-txt');
    this.forecastItemsContainer = document.querySelector('.forecast-items-container');
    this.favBtn = document.querySelector('#fav-btn');
    this.cityNameEl = document.querySelector('#city-name');
    this.citySelEl = document.querySelector('#citySelection');
    this.preloaderEl = document.querySelector('.preloader');
    this.unitToggleBtn = document.querySelector('#unit-toggle');
  }

  resetInput(): void {
    if (this.cityInput) {
      this.cityInput.value = '';
      this.cityInput.blur();
    }
    if (this.citySelEl) this.citySelEl.innerHTML = '';
  }

  getCityName(): string {
    return this.cityNameEl?.textContent?.trim() || '';
  }

  togglePreloader(show: boolean): void {
    if (this.preloaderEl) this.preloaderEl.style.display = show ? 'flex' : 'none';
  }

  updateUnitToggleButton(currentScale: 'C' | 'F'): void {
    if (this.unitToggleBtn) {
      this.unitToggleBtn.textContent = currentScale === 'C' ? 'Switch to °F' : 'Switch to °C';
    }
  }

  showCityDropdown(cities: string[], onSelectCity: (city: string) => void): void {
    if (!this.citySelEl) return;
    this.citySelEl.innerHTML = '';
    const ul = document.createElement('ul');

    cities.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city;
      li.classList.add('city-sel-item');
      li.addEventListener('click', () => {
        onSelectCity(city);
        this.citySelEl!.innerHTML = '';
      });
      ul.appendChild(li);
    });

    this.citySelEl.appendChild(ul);
  }

  hideCityDropdown(): void {
    if (this.citySelEl) this.citySelEl.innerHTML = '';
  }

  showSection(sectionName: 'weatherInfo' | 'searchCity' | 'notFound'): void {
    const sections: Record<string, HTMLElement | null> = {
      weatherInfo: this.weatherInfoSection,
      searchCity: this.searchCitySection,
      notFound: this.notFoundSection,
    };

    Object.values(sections).forEach(s => {
      if (s) s.style.display = 'none';
    });
    if (sections[sectionName]) sections[sectionName]!.style.display = 'flex';
  }

  updateWeatherDisplay(data: any): void {
    if (!data) return;

    const {
      name,
      main: { temp, humidity },
      weather: [{ id, main }],
      wind: { speed },
    } = data;

    const scale = localStorage.getItem('temperatureScaleUnit') as 'C' | 'F' | null;
    const displayTemp =
      scale === 'C'
        ? Math.round(temp) + ' °C'
        : WeatherService.celsius2fahrenheit(temp) + ' °F';

    if (this.countryTxt) this.countryTxt.textContent = name;
    if (this.tempTxt) this.tempTxt.innerHTML = displayTemp;
    if (this.conditionTxt) this.conditionTxt.textContent = main;
    if (this.humidityValueTxt) this.humidityValueTxt.textContent = humidity + ' %';
    if (this.windValueTxt) this.windValueTxt.textContent = speed + ' m/s';
    if (this.currentDateTxt) this.currentDateTxt.textContent = WeatherService.getFormattedDate();
    if (this.weatherSummaryImg) this.weatherSummaryImg.src = `assets/weather/${WeatherService.getWeatherIcon(id)}`;
    if (this.cityNameEl) this.cityNameEl.textContent = name;

    this.setWeatherBackground(id, temp);
  }

  updateForecastDisplay(forecastData: any): void {
    if (!forecastData || !forecastData.list || !this.forecastItemsContainer) return;

    const items = forecastData.list.filter(
      (item: any) =>
        item.dt_txt.includes('12:00:00') &&
        !item.dt_txt.includes(new Date().toISOString().split('T')[0])
    );

    this.forecastItemsContainer.innerHTML = '';
    items.forEach(({ dt_txt, main: { temp }, weather: [{ id }] }: any) => {
      const date = new Date(dt_txt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
      });

      const scale = localStorage.getItem('temperatureScaleUnit') as 'C' | 'F' | null;
      const displayTemp =
        scale === 'C'
          ? Math.round(temp) + ' °C'
          : WeatherService.celsius2fahrenheit(temp) + ' °F';

      const forecastItem = `
        <div class="forecast-item">
          <h5 class="forecast-item-date regular-txt">${date}</h5>
          <img src="assets/weather/${WeatherService.getWeatherIcon(id)}" class="firecast-item-img">
          <h5 class="forecast-item-temp">${displayTemp}</h5>
        </div>
      `;

      this.forecastItemsContainer!.insertAdjacentHTML('beforeend', forecastItem);
    });
  }

  setWeatherBackground(id: number, temp: number): void {
    const container = document.body;

    let gradient = '';

    if (id >= 200 && id < 300) gradient = 'linear-gradient(to top, #3a3a3a, #000000)';
    else if (id >= 300 && id < 600) gradient = 'linear-gradient(to top, #4e54c8, #8f94fb)';
    else if (id >= 600 && id < 700) gradient = 'linear-gradient(to top, #83a4d4, #b6fbff)';
    else if (id >= 700 && id < 800) gradient = 'linear-gradient(to top, #bdc3c7, #2c3e50)';
    else if (id === 800) gradient = 'linear-gradient(to top, #f7971e, #ffd200)';
    else if (id > 800) gradient = 'linear-gradient(to top, #757f9a, #d7dde8)';

    container.style.background = gradient;
  }

  updateFavButton(isFavorite: boolean): void {
    if (this.favBtn) {
      this.favBtn.innerHTML = isFavorite ? 'stars' : 'star';
      this.favBtn.classList.remove('hidden');
    }
  }
}
