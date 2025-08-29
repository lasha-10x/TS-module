export class StorageService {
    key;
    constructor() {
        this.key = 'cities';
    }
    /**
     * Get saved cities from localStorage
     */
    getCities() {
        const stored = localStorage.getItem(this.key);
        return stored ? JSON.parse(stored) : [];
    }
    /**
     * Check if a city is in favorites
     */
    isFavorite(city) {
        return this.getCities().includes(city.toLowerCase());
    }
    /**
     * Save temperature scale unit (C or F)
     */
    setTemperatureScaleUnit(unit) {
        localStorage.setItem('temperatureScaleUnit', unit);
    }
    /**
     * Get temperature scale unit, default to 'C'
     */
    getTemperatureScaleUnit() {
        const unit = localStorage.getItem('temperatureScaleUnit');
        return unit === 'F' ? 'F' : 'C';
    }
    /**
     * Toggle a city in favorites
     */
    toggleFavorite(city) {
        const cities = this.getCities();
        const cityLower = city.toLowerCase();
        let updatedCities;
        if (cities.includes(cityLower)) {
            updatedCities = cities.filter(c => c !== cityLower);
        }
        else {
            updatedCities = [...cities, cityLower];
        }
        if (updatedCities.length === 0) {
            localStorage.removeItem(this.key);
        }
        else {
            localStorage.setItem(this.key, JSON.stringify(updatedCities));
        }
        return updatedCities.includes(cityLower);
    }
}
//# sourceMappingURL=storage-service.js.map