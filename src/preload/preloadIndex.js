const {
    contextBridge, 
    ipcRenderer, 
    clipboard,
    webFrame
} = require('electron');
const child = require('child_process').exec;
const path = require("path");
require('dotenv').config({path: path.join(__dirname, "../.env")});

const loudness = require('loudness')
const clipboardListener = require('clipboard-event');
const si = require('systeminformation');
const storage = require('electron-json-storage');

const emptyApplicationStorage = {
    data: []
};

let cityCoords;
let weatherData;
let applications;

clipboardListener.startListening();

ipcRenderer.invoke('get-user-data-path').then(path => {
    storage.setDataPath(path + "/Storage");
})

function getApplications() {
    if (!applications) {
        applications = storage.getSync("applications");
    }

    if (!applications.data) {
        applications = JSON.parse(JSON.stringify(emptyApplicationStorage));

        Promise.resolve(JSON.parse(JSON.stringify(emptyApplicationStorage)));
    }

    if (!applications.data.every(app => Object.values(app).length == 3)) {
        applications.data.forEach((app, index) => {
            setApplicationData(index, app.path);
        });
    }

    return new Promise(function (resolve) {
        (function waitForCompletion(){

            if (applications.data.every(app => Object.values(app).length == 3)) {
                resolve(applications)
            } else {
                setTimeout(waitForCompletion, 300);
            }
        })();
    });
}

function extractAppFileName(path) {
    return path.match(/(?<process>[\w\.-]*)\.exe/i)[1];
}

function addApplication(path) {
    return getApplications().then(applications => {
        applications.data.push({
            path: path
        });
        saveApplications(applications);
    });
}

function deleteApplication(index) {
    return getApplications().then(applications => {
        applications.data.splice(index, 1)
        saveApplications(applications);
    });
}

function renameApplication(index, name) {
    return getApplications().then(applications => {
        applications.data[index].name = name;
        saveApplications(applications);
    });
}

function saveApplications(applications) {
    const storageList = JSON.parse(JSON.stringify(emptyApplicationStorage));

    applications.data.forEach(app => {
    storageList.data.push({
            name: app.name,
            path: app.path
        });
    });

    storage.set("applications", storageList);
}

function setApplicationData(index, path) {
    if (!applications.data[index].name) {
        applications.data[index].name = extractAppFileName(path);
    }
    ipcRenderer.invoke('get-file-icon', path).then(dataUrl => {
        applications.data[index].dataUrl = dataUrl;
    });
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
    deleteApplication: (index) => deleteApplication(index),
    renameApplication: (index, name) => renameApplication(index, name),
    openApplication: (path) => {
        ipcRenderer.invoke('close-window', '');

        child(`"${path}"`, (err, stdout, stderr) => {
            if(err){
               console.error(err);
               return;
            }
    
            console.log(stdout);
        })
    },

    // Settings
    getUserSettings: () => storage.getSync("settings"),
    setUserSettings: (object) => storage.set("settings", object),
    getZoomFactor: () => webFrame.getZoomFactor(),
    setZoomFactor: (factor) => webFrame.setZoomFactor(factor),
    setStartupSetting: (bool) => {
        ipcRenderer.invoke('set-startup-setting', bool);
    }
})