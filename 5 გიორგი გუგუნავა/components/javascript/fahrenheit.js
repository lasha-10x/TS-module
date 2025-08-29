// utils/temperature.ts
/**
 * Converts temperature from Kelvin to Fahrenheit.
 * @param kelvin - Temperature in Kelvin
 * @returns Temperature in Fahrenheit (rounded, with °F suffix)
 */
const KelvinToFahrenheit = (kelvin) => {
    const fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
};
// Example usage:
console.log(KelvinToFahrenheit(300)); // "80°F"
export {};
//# sourceMappingURL=fahrenheit.js.map