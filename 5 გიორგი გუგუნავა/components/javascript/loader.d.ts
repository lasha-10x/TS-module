/**
 * Displays the loader and hides the weather content.
 */
declare const showLoader: () => void;
/**
 * Hides the loader and displays the weather content.
 */
declare const hideLoader: () => void;
declare global {
    interface Window {
        showLoader?: () => void;
        hideLoader?: () => void;
    }
}
export { showLoader, hideLoader };
//# sourceMappingURL=loader.d.ts.map