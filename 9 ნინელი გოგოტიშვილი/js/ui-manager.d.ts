export declare class UI {
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
    constructor();
    resetInput(): void;
    getCityName(): string;
    togglePreloader(show: boolean): void;
    updateUnitToggleButton(currentScale: 'C' | 'F'): void;
    showCityDropdown(cities: string[], onSelectCity: (city: string) => void): void;
    hideCityDropdown(): void;
    showSection(sectionName: 'weatherInfo' | 'searchCity' | 'notFound'): void;
    updateWeatherDisplay(data: any): void;
    updateForecastDisplay(forecastData: any): void;
    setWeatherBackground(id: number, temp: number): void;
    updateFavButton(isFavorite: boolean): void;
}
//# sourceMappingURL=ui-manager.d.ts.map