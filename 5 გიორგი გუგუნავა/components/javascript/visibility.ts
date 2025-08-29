// Function to calculate visibility in kilometers
const calculateVisibility = (meter: number): string => {
  const kilometer: number = meter / 1000;
  return Math.round(kilometer) + "km";
};

// Example usage
console.log(calculateVisibility(10000)); // Output: "10km"
