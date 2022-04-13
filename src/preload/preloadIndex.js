const { 
    contextBridge, 
    ipcRenderer, 
    clipboard,
} = require('electron');
const loudness = require('loudness')
const clipboardListener = require('clipboard-event');
const si = require('systeminformation');
const path = require("path");
require('dotenv').config({path: path.join(__dirname, "../.env")});

let cityCoords;
let weatherData;

clipboardListener.startListening();

function removeImageUrlPrefix(dataUrl) {
    let data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    return Buffer.from(data, 'base64');
}

async function saveDialog(content, fileType) {
    ipcRenderer.invoke('open-save-dialog', content, fileType);
}

// Fetch weather data
async function getWeatherData(city, updatedCity) {
    if (!cityCoords || updatedCity) {
        await getCoords(city);
    }

    let request = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityCoords[0].lat}&lon=${cityCoords[0].lon}&exclude=minutely,hourly,alerts&appid=${process.env.WEATHER_API_KEY}`)
    let response = await request.json();
    
    weatherData = response;
    
    return weatherData;
}

// Fetch coords of corresponding city
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
    removeImageUrlPrefix: (dataUrl) => removeImageUrlPrefix(dataUrl),
    imageIsEmpty: () => {
        return clipboard.readImage().isEmpty()
    },

    // Weather
    getWeatherData: (city, updatedCity) => getWeatherData(city, updatedCity),
    getCoords: (city) => getCoords(city),

    // Save Dialog
    saveDialog: (content, fileType) => saveDialog(content, fileType),

    // System Information
    cpuLoad: () => si.currentLoad().then(data => Math.floor(data.currentLoad)),
    memoryLoad: () => {
        return si.mem().then(data => {
            return {
                total: data.total,
                used: data.used,
                usage: Math.floor(data.used / data.total * 100)
            };
        });
    },
    diskSpace: () => {
        return si.fsSize().then(data => {
            return data;
        });
    },
    gpuLoad: async () => {
        const graphics = await si.graphics();
        const controllers = []
        graphics.controllers.forEach(controller => {
            if (!controller.vramDynamic) {
                controllers.push( {
                    model: controller.model,
                    usage: Math.floor(controller.memoryUsed / controller.memoryTotal * 100)
                })
            }
        })
        return controllers;
    },
})