export class StorageService {
  private key: string;

  constructor() {
    this.key = 'cities';
  }

  /**
   * Get saved cities from localStorage
   */
  getCities(): string[] {
    const stored = localStorage.getItem(this.key);
    return stored ? JSON.parse(stored) as string[] : [];
  }

  /**
   * Check if a city is in favorites
   */
  isFavorite(city: string): boolean {
    return this.getCities().includes(city.toLowerCase());
  }

  /**
   * Save temperature scale unit (C or F)
   */
  setTemperatureScaleUnit(unit: 'C' | 'F'): void {
    localStorage.setItem('temperatureScaleUnit', unit);
  }

  /**
   * Get temperature scale unit, default to 'C'
   */
  getTemperatureScaleUnit(): 'C' | 'F' {
    const unit = localStorage.getItem('temperatureScaleUnit');
    return unit === 'F' ? 'F' : 'C';
  }

  /**
   * Toggle a city in favorites
   */
  toggleFavorite(city: string): boolean {
    const cities = this.getCities();
    const cityLower = city.toLowerCase();
    let updatedCities: string[];

    if (cities.includes(cityLower)) {
      updatedCities = cities.filter(c => c !== cityLower);
    } else {
      updatedCities = [...cities, cityLower];
    }

    if (updatedCities.length === 0) {
      localStorage.removeItem(this.key);
    } else {
      localStorage.setItem(this.key, JSON.stringify(updatedCities));
    }

    return updatedCities.includes(cityLower);
  }
}
