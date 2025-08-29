// Function to calculate visibility in kilometers
const calculateVisibility = (meter) => {
    const kilometer = meter / 1000;
    return Math.round(kilometer) + "km";
};
// Example usage
console.log(calculateVisibility(10000)); // Output: "10km"
export {};
//# sourceMappingURL=visibility.js.map