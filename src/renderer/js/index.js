import {TimeDate} from  "./widgets/timeDate.js";
import {SystemVolume} from  "./widgets/systemVolume.js";


// TimeDate
const timeDate = new TimeDate();

// Volume
const systemVolume = new SystemVolume();

// Modal
const modal = document.getElementById("myModal");
const tempPath = "templates/";

// Clipboard
const contentDiv = document.getElementById("clipboard");

// Weather
let currentCity = "Hoogeveen";
const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const forecastDays = 3;

window.onload = function () {
    updateClipboard();
    updateWeather();
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


/* NOTEPAD */ 
// Event for clearing the notepad on click
document.getElementById("clearNotepad").addEventListener("click", function() {
    document.getElementById('notepad').value = '';
});


/* Clipboard */
// Event for clearing clipboard
document.getElementById("clearClipboard").addEventListener("click", function() {
    api.clearClipboard();
});

// Update clipboard when clipboard change event is fired
api.onClipboardChanged('change', () => {
    updateClipboard();
});

// Update cllipboard content
function updateClipboard() {
    const text = api.readClipboardText();
    const image = api.readClipboardImage();
    
    if (text) {
        setClipboardText(text);
    } 
    else if (!api.imageIsEmpty()) {
        setClipboardImage(image);
    } 
    else {
        setClipboardEmpty();
    }
}

// Set the image in the clipboard content
function setClipboardImage(image) {
    contentDiv.innerHTML = `<img class="clipboard-image" id="clipboardImg" src="${image}">`;
    
    const clipboardImage = document.getElementById("clipboardImg");
    clipboardImage.onclick = function() {
        loadImageModal(image);
    }
}

// Set the text in the clipboard content
function setClipboardText(text) {
    contentDiv.innerHTML = `
    <div class="clipboard-text">
        <p >${escapeHtml(text)}</p>
    </div>`;
}

// Default empty clipboard
function setClipboardEmpty() {
    contentDiv.innerHTML = `
    <p class="clipboard-empty">
        Clipboard is empty
    </p>`;
}

// Convert plain html to html entities to prevent xss injection and html interruption
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}  

/* MODAL FUNCTIONS */
// Show modal
function setModal() {
    modal.classList.remove("hidden");
}

// Hide modal
function unsetModal() {
    modal.classList.add("hidden");
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        unsetModal();
    }
}

// Load modal content by fetching a template
async function loadModal(file) {  
    let request = await fetch(tempPath + file);
    let response = await request.text();

    document.getElementById("myModal").innerHTML = response;
    
    setModal();
}

// Load modal that previews the image
async function loadImageModal(image) {
    await loadModal("imageModal.html");
    
    const modal = document.getElementById("modalImage");
    modal.src = image;
}