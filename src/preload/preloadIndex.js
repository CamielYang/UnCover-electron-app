const {
    contextBridge, 
    ipcRenderer, 
    clipboard,
    webFrame
} = require('electron');
const loudness = require('loudness')
const clipboardListener = require('clipboard-event');
const si = require('systeminformation');
const path = require("path");
const storage = require('electron-json-storage');
const iconExtractor = require('icon-extractor');
require('dotenv').config({path: path.join(__dirname, "../.env")});

const applications = [
    {
        path: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    },
    {
        path: 'C:/Program Files (x86)/Dropbox/Client/Dropbox.exe'
    },
    {
        path: 'C:/Users/camie/Documents/Projects/UnCover-electron-app/out/UnCover-win32-x64/UnCover.exe'
    },
    {
        path: 'D:/SteamLibrary/steamapps/common/rocketleague/Binaries/Win64/RocketLeague.exe'
    },
    {
        path: 'D:/Minecraft Launcher/MinecraftLauncher.exe'
    },
    {
        path: 'D:/SteamLibrary/steamapps/common/rocketleague/Binaries/Win64/RocketLeague.exe'
    },
    {
        path: 'D:/SteamLibrary/steamapps/common/Apex Legends/r5Apex.exe'
    },
    {
        path: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    },
    {
        path: 'C:/Program Files (x86)/Dropbox/Client/Dropbox.exe'
    },
    {
        path: 'D:/SteamLibrary/steamapps/common/rocketleague/Binaries/Win64/RocketLeague.exe'
    },
    {
        path: 'D:/SteamLibrary/steamapps/common/rocketleague/Binaries/Win64/RocketLeague.exe'
    },
    {
        path: 'D:/SteamLibrary/steamapps/common/Apex Legends/r5Apex.exe'
    }
]

let cityCoords;
let weatherData;

clipboardListener.startListening();

ipcRenderer.invoke('get-user-data-path').then(path => {
    storage.setDataPath(path + "/Storage");
})

iconExtractor.emitter.on('icon', function(data){
    applications[data.Context].base64 = data.Base64ImageData;
});

applications.forEach((app, index) => {
    applications[index].name = extractAppFileName(app.path);
    iconExtractor.getIcon(index, app.path);
});

function extractAppFileName(path) {
    return path.match(/(?<process>[\w\.-]*)\.exe/)[1];
}

function getApplications() { 
    return new Promise(function (resolve) {
        (function waitForCompletion(){
            if (applications.every((app)=> app.base64)) return resolve(applications);
            setTimeout(waitForCompletion, 300);
        })();
    });
}

function addApplication(path) {
    const appIndex = applications.push({
        path: path
    }) - 1;

    iconExtractor.getIcon(appIndex, path)
}

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

// Exposed methods for the renderer page
contextBridge.exposeInMainWorld("api", {
    // Uncover window
    openWindow: () => ipcRenderer.invoke('open-window', ''),

    // Volume control
    getVolume: () => loudness.getVolume(),
    setVolume: (value) => loudness.setVolume(value),
    getMuted: () => loudness.getMuted(),
    setMuted: (bool) => loudness.setMuted(bool),

    // Clipboard
    onClipboardChanged: (event, listener) => clipboardListener.on(event, listener),
    clearClipboard: () => clipboard.clear(),
    getClipboardAvailableFormats: () => clipboard.availableFormats(),
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
        const data = process.getSystemMemoryInfo();

        return {
            total: data.total,
            used: data.total - data.free,
            usage: Math.floor((data.total - data.free) / data.total * 100)
        };
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
            // Only push graphics controllers that are non dedicated (static VRAM)
            if (!controller.vramDynamic) {
                controllers.push( {
                    model: controller.model,
                    usage: Math.floor(controller.memoryUsed / controller.memoryTotal * 100)
                })
            }
        })
        return controllers;
    },

    // Application Manager
    getApplications: () => getApplications(),
    addApplication: (path) => addApplication(path),

    // Settings
    getUserSettings: () => storage.getSync("settings"),
    setUserSettings: (object) => storage.set("settings", object),
    getZoomFactor: () => webFrame.getZoomFactor(),
    setZoomFactor: (factor) => webFrame.setZoomFactor(factor),
    setStartupSetting: (bool) => {
        ipcRenderer.invoke('set-startup-setting', bool);
    }
})