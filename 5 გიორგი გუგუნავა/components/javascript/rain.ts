// utils/rain.ts
// This file manages the visual effect of rain on the webpage, creating and animating raindrop elements.

const contentWrapper = document.getElementsByClassName(
  "content_wrapper"
) as HTMLCollectionOf<HTMLElement>;
let raining: number | null = null;

/**
 * Creates a single raindrop element and animates it.
 */
const createRainDrop = (): void => {
  if (contentWrapper.length === 0) return;

  const rainDrop: HTMLElement = document.createElement("i");
  rainDrop.classList.add("fas", "fa-droplet");

  // Randomize styles for natural effect
  rainDrop.style.left = `${Math.random() * contentWrapper[0]!.clientWidth}px`;
  rainDrop.style.animationDuration = `${Math.random() * 1 + 1}s`;
  rainDrop.style.opacity = Math.random().toString();
  rainDrop.style.fontSize = `${Math.random() * 3 + 3}px`;

  contentWrapper[0]!.appendChild(rainDrop);

  // Remove after animation
  setTimeout(() => {
    rainDrop.remove();
  }, 5000);
};

/**
 * Starts the rain animation by creating drops repeatedly.
 */
const startRain = (): void => {
  if (!raining) {
    raining = window.setInterval(createRainDrop, 10);
  }
};

/**
 * Stops the rain animation by clearing the interval.
 */
const stopRain = (): void => {
  if (raining) {
    clearInterval(raining);
    raining = null;
  }
};

export { startRain, stopRain };
