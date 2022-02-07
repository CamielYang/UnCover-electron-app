const { 
    contextBridge, 
    ipcRenderer, 
    clipboard, 
} = require('electron');
require('dotenv').config();
const loudness = require('loudness')
const clipboardListener = require('clipboard-event');
// let cityCoords;
// let currentWeather;

// Sample API Calls
let cityCoords = [{"name":"Hoogeveen","local_names":{"nl":"Hoogeveen","fy":"Hegefean"},"lat":52.7264258,"lon":6.49308148854467,"country":"NL","state":"Drenthe"}];
let currentWeather = {"coord":{"lon":6.4931,"lat":52.7264},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"base":"stations","main":{"temp":280.15,"feels_like":276.2,"temp_min":279.72,"temp_max":281.22,"pressure":1023,"humidity":74,"sea_level":1023,"grnd_level":1022},"visibility":10000,"wind":{"speed":7.09,"deg":285,"gust":11.78},"clouds":{"all":10},"dt":1644242085,"sys":{"type":2,"id":2037526,"country":"NL","sunrise":1644217593,"sunset":1644251389},"timezone":3600,"id":2753719,"name":"Hoogeveen","cod":200};

clipboardListener.startListening();

async function getCurrentWeather(city) {
    if (!cityCoords) {
        await getCoords(city);
    }
    if (!currentWeather) {
        let request = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${cityCoords[0].lat}&lon=${cityCoords[0].lon}&appid=${process.env.WEATHER_API_KEY}`);
        let response = await request.json();
        
        currentWeather = response;
    }
    return currentWeather;
}

async function getCoords(city) {
    let request = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.WEATHER_API_KEY}`);
    let response = await request.json();
    
    cityCoords = response;

    return cityCoords;
}

// Waits until the view is completely loaded
window.addEventListener("DOMContentLoaded", () => {
    /* ipcRenderers */
    // Event for closing the main window on click
    document.getElementById("closeWinBtn").addEventListener("click", function() {
        ipcRenderer.invoke('close-window', '');
    });

    // Event for opening web browser on click
    document.getElementById("openWebBtn").addEventListener("click", function() {
        ipcRenderer.invoke('open-web-browser', '');
    });
});

contextBridge.exposeInMainWorld("api", {
    // Volume control
    getVolume: () => loudness.getVolume(),
    setVolume: (value) => loudness.setVolume(value),
    getMuted: () => loudness.getMuted(),
    setMuted: (bool) => loudness.setMuted(bool),

    // Clipboard
    onClipboardChanged: (event, listener) => clipboardListener.on(event, listener),
    clearClipboard: () => clipboard.clear(),
    readClipboardText: () => clipboard.readText(),
    readClipboardImage: () => clipboard.readImage().toDataURL(),
    imageIsEmpty: () => {
        return clipboard.readImage().isEmpty()
    },

    // Weather
    getCurrentWeather: (city) => getCurrentWeather(city),
    getCoords: (city) => getCoords(city),
    
})