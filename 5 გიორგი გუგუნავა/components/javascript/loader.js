// utils/loader.ts
// Query elements
const loader = document.getElementsByClassName("sk-cube-grid");
const WEATHER_CONTENT = document.getElementsByClassName("city_container");
/**
 * Displays the loader and hides the weather content.
 */
const showLoader = () => {
    if (loader.length > 0)
        loader[0].style.display = "block";
    if (WEATHER_CONTENT.length > 0)
        WEATHER_CONTENT[0].style.display = "none";
};
/**
 * Hides the loader and displays the weather content.
 */
const hideLoader = () => {
    if (loader.length > 0)
        loader[0].style.display = "none";
    if (WEATHER_CONTENT.length > 0)
        WEATHER_CONTENT[0].style.display = "flex";
};
// Attach functions to window object
window.showLoader = showLoader;
window.hideLoader = hideLoader;
export { showLoader, hideLoader };
//# sourceMappingURL=loader.js.map