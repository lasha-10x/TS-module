export declare class StorageService {
    private key;
    constructor();
    /**
     * Get saved cities from localStorage
     */
    getCities(): string[];
    /**
     * Check if a city is in favorites
     */
    isFavorite(city: string): boolean;
    /**
     * Save temperature scale unit (C or F)
     */
    setTemperatureScaleUnit(unit: 'C' | 'F'): void;
    /**
     * Get temperature scale unit, default to 'C'
     */
    getTemperatureScaleUnit(): 'C' | 'F';
    /**
     * Toggle a city in favorites
     */
    toggleFavorite(city: string): boolean;
}
//# sourceMappingURL=storage-service.d.ts.map