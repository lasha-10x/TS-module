// ui.ts
import { getDOMElements } from "./domElements";
// ---------------- Module State ----------------
let elements;
// ---------------- Init ----------------
export function initUIElements() {
    elements = getDOMElements();
}
// ---------------- Loader ----------------
export function showLoader() {
    if (elements?.loaderWrapper) {
        elements.loaderWrapper.classList.remove("hidden");
        elements.loaderWrapper.style.opacity = "1";
    }
}
export function hideLoader() {
    if (elements?.loaderWrapper) {
        elements.loaderWrapper.style.opacity = "0";
        elements.loaderWrapper.addEventListener("transitionend", function () {
            elements?.loaderWrapper?.classList.add("hidden");
        }, { once: true });
    }
}
// ---------------- Error Message ----------------
export function displayErrorMessage(message) {
    if (elements?.errorMessageElement) {
        elements.errorMessageElement.textContent = message;
    }
}
//# sourceMappingURL=ui.js.map