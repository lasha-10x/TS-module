// theme.ts
function setupThemeButtons() {
    // Use as NodeListOf<HTMLButtonElement> to cast safely
    const themeButtons = document.querySelectorAll(".theme-btn");
    themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Remove active state from all buttons
            themeButtons.forEach((btn) => {
                btn.classList.remove("active");
                btn.setAttribute("aria-pressed", "false");
            });
            // Set active state for clicked button
            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");
            // Get theme name safely
            const selectedTheme = button.dataset.theme ??
                button.textContent?.trim().toLowerCase() ??
                "day";
            applyTheme(selectedTheme);
        });
    });
}
function applyTheme(themeName) {
    // Remove all theme classes
    document.body.classList.remove("blue-gradient-theme", "pink-gradient-theme", "dark-gradient-theme");
    // Map themeName to CSS class
    let themeClass = "blue-gradient-theme";
    switch (themeName.toLowerCase()) {
        case "day":
        case "light":
            themeClass = "blue-gradient-theme";
            break;
        case "night":
        case "dark":
            themeClass = "dark-gradient-theme";
            break;
        case "gradient":
        case "pink":
            themeClass = "pink-gradient-theme";
            break;
    }
    document.body.classList.add(themeClass);
    // Save theme to localStorage
    localStorage.setItem("selectedTheme", themeName);
}
document.addEventListener("DOMContentLoaded", () => {
    setupThemeButtons();
    const savedTheme = localStorage.getItem("selectedTheme") ?? "day";
    const initialButton = document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`);
    if (initialButton) {
        initialButton.click();
    }
    else {
        applyTheme(savedTheme);
    }
});
export {};
//# sourceMappingURL=themeChanger.js.map