// utils/snow.ts
// This file manages the visual effect of snowing on the webpage, creating and animating snowflake elements.

const contentWrapper = document.getElementsByClassName(
  "content_wrapper"
) as HTMLCollectionOf<HTMLElement>;
let snowing: number | null = null;

/**
 * Creates a single snowflake element and animates it.
 */
const createSnowFlake = (): void => {
  if (contentWrapper.length === 0) return;

  const snowFlake: HTMLElement = document.createElement("i");
  snowFlake.classList.add("fas", "fa-snowflake");

  // Randomize position, size, and animation
  snowFlake.style.left = `${Math.random() * contentWrapper[0]!.clientWidth}px`;
  snowFlake.style.animationDuration = `${Math.random() * 5 + 4}s`; // 4–9s
  snowFlake.style.opacity = Math.random().toString();
  snowFlake.style.fontSize = `${Math.random() * 4 + 4}px`; // 4–8px

  contentWrapper[0]!.appendChild(snowFlake);

  // Remove snowflake after it falls
  setTimeout(() => {
    snowFlake.remove();
  }, 10000);
};

/**
 * Starts the snow animation.
 */
const startSnow = (): void => {
  if (!snowing) {
    snowing = window.setInterval(createSnowFlake, 50); // create snowflakes every 50ms
  }
};

/**
 * Stops the snow animation.
 */
const stopSnowing = (): void => {
  if (snowing) {
    clearInterval(snowing);
    snowing = null;
  }
};

export { startSnow, stopSnowing };
