import { setBaseTemplatePath, setModalId } from "./widgets/modal.js";
import { TimeDate } from  "./widgets/timeDate.js";
import { SystemVolume } from  "./widgets/systemVolume.js";
import { Notepad } from "./widgets/notepad.js";
import { Clipboard } from "./widgets/clipboard.js";

// Modal
setModalId("myModal");
setBaseTemplatePath("templates/")

// TimeDate
const timeDate = new TimeDate();

// Volume
const systemVolume = new SystemVolume();

// Notepad
const notepad = new Notepad();

// Clipboard
const clipboard = new Clipboard();

// Weather
let currentCity = "Hoogeveen";
const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const forecastDays = 3;

window.onload = function () {
    //updateWeather();
}


/* WEATHER */
function setCurrentCity(city) {
    currentCity = city;
}

// Convert Kelvin temperature to Celcius
function kelvinToCelcius(kelvin) {
    return parseInt(kelvin - 273.15)
}

// Update weather content
async function updateWeather(city) {
    let weatherData;
    if (city) {
        setCurrentCity(city);
        weatherData = await api.getWeatherData(city, true);
    }
    else {
        weatherData = await api.getWeatherData(currentCity, false);
    } 

    updateCurrentWeather(weatherData.current);
    updateForecastWeather(weatherData.daily);
}

// Update the current weather data
function updateCurrentWeather(weatherData) {
    const icon = document.getElementById("currentWeatherIcon");
    const temp = document.getElementById("currentWeatherTemp");
    const city = document.getElementById("currentWeatherCity");

    temp.innerText = `${kelvinToCelcius(weatherData.temp)}°`;
    city.innerText = currentCity;
    icon.innerHTML = `<span class="weather-icon-main bi ${getWeatherIcon(weatherData.weather[0].icon)}"></span>`;
}

// Update the weather forecast section
function updateForecastWeather(weatherData) {
    const forecastDiv = document.getElementById("weatherForecast");
    let forecastInfo = '';

    for(let day = 1; day <= forecastDays; day++) {
        const date = new Date(weatherData[day].dt * 1000);
        forecastInfo += `
        <div class="weather-sub-item">
            <h4>${weekday[date.getDay()]}</h4>
            <span class="weather-icon-sub bi ${getWeatherIcon(weatherData[day].weather[0].icon)}"></span>
            <h4>${kelvinToCelcius(weatherData[day].temp.day)}°</h4>
        </div>`
    }

    forecastDiv.innerHTML = forecastInfo;
}

// Get the icon for the corresponding weather
// Check https://openweathermap.org/weather-conditions for icon code
function getWeatherIcon(icon) {
    const iconCode = icon.substring(0, 2);
    switch (iconCode) {
        case '01':
            return 'bi-sun-fill'
        case '02':
            return 'bi-cloud-sun-fill'
        case '03':
            return 'bi-cloudy-fill'
        case '04':
            return 'bi-clouds-fill'
        case '09':
            return 'bi-cloud-rain-heavy-fill'
        case '10':
            return 'bi-cloud-drizzle-fill'
        case '11':
            return 'bi-cloud-lightning-fill'
        case '13':
            return 'bi-cloud-snow-fill'
        case '50':
            return 'bi-cloud-haze-fill'
        default:
            return 'bi-sun-fill'
    }
}