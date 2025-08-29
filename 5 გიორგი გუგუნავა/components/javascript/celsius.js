// utils/temperature.ts
// Define the type for the function input and output
const KelvinToCelsius = (kelvin) => {
    const celsius = kelvin - 273.15;
    return Math.round(celsius) + "°C";
};
// Example usage
console.log(KelvinToCelsius(300)); // "27°C"
export {};
//# sourceMappingURL=celsius.js.map