const {
    contextBridge,
    ipcRenderer
} = require('electron');
const path = require("path");
require('dotenv').config({path: path.join(__dirname, "../.env")});
const storage = require('electron-json-storage');

// Modules
const { general } = require('./modules/general');
const { clipboard } = require('./modules/clipboard');
const { volume } = require('./modules/volume');
const { weather } = require('./modules/weather');
const { systemInformation } = require('./modules/systemInformation');
const { applications } = require('./modules/applications');
const { settings } = require('./modules/settings');

ipcRenderer.invoke('get-user-data-path').then(path => {
    storage.setDataPath(path + "/Storage");
})

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
    general,
    volume,
    clipboard,
    weather,
    systemInformation,
    applications,
    settings
})
