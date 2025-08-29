// ui.ts
import { getDOMElements } from "./domElements";

// ---------------- Types ----------------
interface UIElements {
  loaderWrapper: HTMLElement | null;
  errorMessageElement: HTMLElement | null;
}

// ---------------- Module State ----------------
let elements: ReturnType<typeof getDOMElements>;

// ---------------- Init ----------------
export function initUIElements(): void {
  elements = getDOMElements();
}

// ---------------- Loader ----------------
export function showLoader(): void {
  if (elements?.loaderWrapper) {
    elements.loaderWrapper.classList.remove("hidden");
    elements.loaderWrapper.style.opacity = "1";
  }
}

export function hideLoader(): void {
  if (elements?.loaderWrapper) {
    elements.loaderWrapper.style.opacity = "0";
    elements.loaderWrapper.addEventListener(
      "transitionend",
      function () {
        elements?.loaderWrapper?.classList.add("hidden");
      },
      { once: true }
    );
  }
}

// ---------------- Error Message ----------------
export function displayErrorMessage(message: string): void {
  if (elements?.errorMessageElement) {
    elements.errorMessageElement.textContent = message;
  }
}
