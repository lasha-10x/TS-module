"use strict";
import { WeatherApp } from "./weatherServices.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = new WeatherApp();
  const {
    saveSettings,
    loadSettings,
    removeSettings,
    saveTheme,
    loadTheme,
    popularCities,
  } = app;
  // DOM Elements
  const menuBtn = document.querySelector(".header__icon-cover.menu");
  const menuBtnIcon = document.querySelector(".fa-solid.fa-ellipsis-vertical");
  const menu = document.querySelector("header .settings");
  const modal = document.querySelector("body .modal");
  const modalCancel = document.querySelector("body .modal .modal__cancel");
  const submenu = document.querySelector(".submenu");
  const darkTheme = document.querySelector(".submenu .dark");
  const lightTheme = document.querySelector(".submenu .light");
  const darkIcon = document.querySelector(".submenu .dark i");
  const lightIcon = document.querySelector(".submenu .light i");
  const body = document.body;
  const weatherSettings = document.querySelector("header .weather__settings");
  const weatherTheme = document.querySelector("header .weather__theme");
  const weatherCity = document.querySelector(".weather__city h2");
  const cityTemp = document.querySelector(".weather__forecast-temp h2");
  const feels = document.querySelector(".weather__feels-temp");
  const weatherSky = document.querySelector(".weather__sky");
  const weatherIcon = document.querySelector(".weather__status img");
  const weatherDate = document.querySelector(".weather__status time");
  const humidity = document.querySelector(".details__item-humidity span");
  const wind = document.querySelector(".details__item-wind span");
  const pressure = document.querySelector(".details__item-pressure span");
  const humidityStatusVal = document.querySelector(
    ".details__item-humidity .status"
  );
  const windStatusVal = document.querySelector(".details__item-wind .status");
  const pressureStatusVal = document.querySelector(
    ".details__item-pressure .status"
  );
  const weatherDays = document.querySelector(".weather__daily .weather__days");
  const weatherDailyItems = document.querySelector(
    ".weather__daily .weather__daily-items"
  );
  const weatherLoader = document.querySelector(".weather__loader");
  const modalInner = document.querySelector(".modal__inner");
  const modalPopular = document.querySelector(".modal__popular-inner");
  const modalHistory = document.querySelector(
    ".modal__history .modal__history-cities"
  );
  const trash = document.querySelector(".modal__trash-btn");
  const saveBtn = document.querySelector(".modal__save-box .modal__save");
  const celsius = document.querySelector(".modal__temperature .celsius");
  const fahrenheit = document.querySelector(".modal__temperature .fahrenheit");
  const celsiusInp = document.querySelector(
    ".modal__temperature .celsius input"
  );
  const fahrenheitInp = document.querySelector(
    ".modal__temperature .fahrenheit input"
  );
  const feelsRain = document.querySelector(".weather__feels-rain .daily-rain");
  const feelsRainChance = document.querySelector(
    ".weather__feels-rain .rain-chance"
  );
  const modalInput = document.querySelector(".modal__input input");
  const humidityDetails = document.querySelector(
    ".weather__details-item.humidity .details__decore"
  );
  const windDetails = document.querySelector(
    ".weather__details-item.wind .details__decore"
  );
  const pressureDetails = document.querySelector(
    ".weather__details-item.pressure .details__decore"
  );
  const turbineSpeed = document.querySelector(
    ".weather__details-item.wind svg #wind__speed"
  );
  const pressureSpeed = document.querySelector(
    ".weather__details-item.pressure svg #presure__speed"
  );
  const humiditySpeed = document.querySelector(
    ".weather__details-item.humidity svg #humidity__speed"
  );
  const loaderCover = document.querySelector("header .loader__cover");
  const loader = document.querySelector("header .loader");
  const errMsg = document.querySelector("header .err__message");
  const errMsgText = document.querySelector("header .err__message span");
  let city = "";
  let tempScale = "C";
  let debounceTimer;
  function loading() {
    weatherLoader.classList.add("show");
  }
  function done() {
    weatherLoader.classList.add("done");
    setTimeout(() => {
      weatherLoader.classList.remove("show");
      weatherLoader.classList.remove("done");
    }, 1100);
  }
  function removeLoader() {
    body.classList.remove("lock");
    loaderCover.classList.add("hide");
    loader.classList.add("hide");
  }
  function addLoader() {
    body.classList.add("lock");
    loaderCover.classList.remove("hide");
    loader.classList.remove("hide");
  }
  function errMessage(err) {
    errMsg.classList.add("show");
    errMsgText.textContent = err;
    body.classList.add("lock");
  }
  menuBtn.addEventListener("click", (e) => {
    const target = e.target;
    if (target === menuBtn || target === menuBtnIcon) {
      menu.classList.add("show");
    }
  });
  body.addEventListener("click", (e) => {
    const target = e.target;
    if (!menuBtn.contains(target) && !menu.contains(target)) {
      menu.classList.remove("show");
      submenu.classList.remove("show");
    }
  });
  weatherSettings.addEventListener("click", () => {
    body.classList.add("lock");
    modal.classList.add("reveal");
    menu.classList.remove("show");
  });
  weatherTheme.addEventListener("click", () => {
    submenu.classList.toggle("show");
  });
  submenu.addEventListener("click", (e) => {
    const target = e.target;
    if (darkTheme.contains(target)) {
      darkIcon.classList.add("fa-check");
      lightIcon.classList.remove("fa-check");
      menu.classList.remove("show");
      body.classList.add("dark");
      saveTheme("dark");
    }
    if (lightTheme.contains(target)) {
      lightIcon.classList.add("fa-check");
      darkIcon.classList.remove("fa-check");
      menu.classList.remove("show");
      body.classList.remove("dark");
      saveTheme("light");
    }
  });
  async function renderWeather(city = "batumi", scale = "C") {
    loading();
    addLoader();
    const cleaned = await app.getWeather(city);
    if (!cleaned) {
      errMessage("Data not found.");
      return;
    }
    try {
      const {
        humidityStatus,
        windStatus,
        pressureStatus,
        turbineSpeedCalc,
        pressureSpeedCalc,
        humiditySpeedCalc,
      } = app;
      const {
        tempC,
        tempF,
        feelsLikeC,
        feelsLikeF,
        condition,
        icon,
        humidityTmp,
        windTmp,
        pressureTmp,
      } = cleaned.current;
      const scaleTemp = scale === "C" ? tempC : tempF;
      const feelsLike = scale === "C" ? feelsLikeC : feelsLikeF;
      weatherCity.textContent = cleaned.location;
      cityTemp.textContent = Math.round(scaleTemp).toString();
      feels.textContent = feelsLike.toFixed(1);
      weatherSky.textContent = condition;
      weatherIcon.src = icon.replace("//", "https://");
      weatherDate.textContent = cleaned.date;
      weatherDate.setAttribute("datetime", cleaned.dateattr);
      humidity.textContent = `${humidityTmp} %`;
      wind.textContent = `${windTmp} km/h`;
      pressure.textContent = `${pressureTmp} hPa`;
      humidityDetails.style.setProperty("--humidity-width", `${humidityTmp}%`);
      windDetails.style.setProperty(
        "--wind-width",
        `${Math.min(windTmp, 100)}%`
      );
      pressureDetails.style.setProperty(
        "--pressure-width",
        `${((pressureTmp - 980) / 70) * 100}%`
      );
      turbineSpeed.style.animationDuration = `${turbineSpeedCalc(windTmp)}s`;
      pressureSpeed.style.transform = `rotate(${pressureSpeedCalc(
        pressureTmp
      )}deg)`;
      humiditySpeed.style.transform = `rotate(${humiditySpeedCalc(
        humidityTmp
      )}deg)`;
      humidityStatusVal.textContent = humidityStatus(humidityTmp);
      windStatusVal.textContent = windStatus(windTmp);
      pressureStatusVal.textContent = pressureStatus(pressureTmp);
      weatherDays.textContent = cleaned.forecast.length.toString();
      feelsRain.textContent = cleaned.rain.rain ? "Yes" : "No";
      feelsRainChance.textContent = `(${cleaned.rain.chance}%)`;
      let today = "Today";
      let arrow = "";
      const weatherItems = cleaned.forecast
        .map((item, i) => {
          if (i === 0) {
            arrow = tempC <= item.maxTemp ? "up" : "down";
            item.weekday = today;
          } else {
            arrow =
              cleaned.forecast[i - 1].maxTemp < item.maxTemp ? "up" : "down";
          }
          return `<div class="weather__daily-item">
                            <div class="weather__daily-day">${
                              item.weekday
                            }</div>
                            <div class="weather__daily-status">
                                <img src="${item.icon.replace(
                                  "//",
                                  "https://"
                                )}" alt="status">
                                <span>${item.condition}</span>
                            </div>
                            <div class="weather__daily-temp">
                                <img class="weather__temp-direction" src="./img/arrow-${arrow}.svg"
                                    alt="temp-direction">
                                <h4 class="weather__temp-degree">
                                    <span class="degree__temp">${Math.round(
                                      item.maxTemp
                                    )}</span>
                                    <span>°</span>
                                </h4>
                                <h4 class="weather__temp-feels">
                                    <span class="feels__temp">${Math.round(
                                      item.minTemp
                                    )}</span>
                                    <span>°</span>
                                </h4>
                            </div>
                        </div>`;
        })
        .join("");
      weatherDailyItems.innerHTML = weatherItems;
    } catch (error) {
      errMessage("Error processing weather data.");
      console.error(error);
    } finally {
      removeLoader();
      done();
    }
  }
  // Initialize theme
  const theme = loadTheme();
  if (theme?.theme === "dark") {
    body.classList.add("dark");
    darkIcon.classList.add("fa-check");
    lightIcon.classList.remove("fa-check");
  } else {
    body.classList.remove("dark");
    darkIcon.classList.remove("fa-check");
    lightIcon.classList.add("fa-check");
  }
  const settings = loadSettings();
  renderWeather(settings?.city ?? "batumi", settings?.tempScale ?? "C");
  if (settings?.city) {
    const historySpan = document.createElement("span");
    historySpan.textContent = settings.city;
    modalHistory.appendChild(historySpan);
    celsiusInp.checked = settings.tempScale === "C";
    fahrenheitInp.checked = settings.tempScale === "F";
  }
  // Modal Inner click events
  modalInner.addEventListener("click", (e) => {
    const target = e.target;
    const span = target.closest("span");
    if (span && (modalHistory.contains(span) || modalPopular.contains(span))) {
      city = span.textContent || "";
      saveBtn.classList.add("show");
    }
    if (span && modalPopular.contains(span)) {
      const elem = document.createElement("span");
      elem.textContent = span.textContent || "";
      if (modalHistory.children.length === 1) {
        modalHistory.removeChild(modalHistory.lastElementChild);
      }
      modalHistory.prepend(elem);
    }
    if (trash.contains(target)) {
      removeSettings();
      modalHistory.innerHTML = "";
      saveBtn.classList.remove("show");
    }
    if (celsius.contains(target)) {
      tempScale = "C";
      saveBtn.classList.add("show");
    }
    if (fahrenheit.contains(target)) {
      tempScale = "F";
      saveBtn.classList.add("show");
    }
    if (saveBtn.contains(target)) {
      if (!city && settings) city = settings.city;
      saveSettings(city, tempScale);
      renderWeather(city, tempScale);
      saveBtn.classList.remove("show");
      body.classList.remove("lock");
      modal.classList.remove("reveal");
      modalInput.value = "";
      popularCities(modalPopular);
    }
    if (modalCancel.contains(target)) {
      body.classList.remove("lock");
      modal.classList.remove("reveal");
      saveBtn.classList.remove("show");
      modalInput.value = "";
      popularCities(modalPopular);
    }
  });
  // Search input
  modalInput.addEventListener("input", (e) => {
    const value = e.target.value.trim();
    if (value.length === 0) {
      popularCities(modalPopular);
      return;
    }
    if (value.length <= 2) return;
    clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(async () => {
      addLoader();
      try {
        const countries = await app.getLocation(value);
        if (!countries || countries.length === 0) {
          modalPopular.innerHTML =
            '<div class="modal__popular-notfound">Data not found</div>';
          return;
        }
        const uniqueSpans = [...new Set(countries)];
        modalPopular.innerHTML = uniqueSpans
          .map((item) => `<span>${item}</span>`)
          .join("");
      } catch (err) {
        console.error(err);
      } finally {
        removeLoader();
      }
    }, 500);
  });
});
//# sourceMappingURL=app.js.map
