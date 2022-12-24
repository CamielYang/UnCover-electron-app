const {
    ipcRenderer,
    webFrame
} = require('electron');
const { LocalFileData, constructFileFromLocalFileData } = require('get-file-object-from-local-path');
const storage = require('electron-json-storage');

const defaultSettings = {
    runAtStartup: false,
    runMinimized: true,
    zoomFactor: 1,
    blur: "10px",
    backgroundTransparency: "50%",
    enableBackgroundImage: false,
    imageFile: null,
    openWeatherApiKey: null
};

function setUserSettings(object) {
    storage.set("settings", object);
}

function getUserSettings() {
    const settings = storage.getSync("settings");

    if (Object.keys(settings).length == 0) {
        setUserSettings(defaultSettings);
        return defaultSettings;
    }
    // Combine default settings and user settings to fill up empty values
    return Object.assign(defaultSettings, settings);
}

const contextBridge = {
    getUserSettings: () => getUserSettings(),
    setUserSettings: (object) => setUserSettings(object),
    getZoomFactor: () => webFrame.getZoomFactor(),
    setZoomFactor: (factor) => webFrame.setZoomFactor(factor),
    setStartupSetting: (bool) => {
        ipcRenderer.invoke('set-startup-setting', bool);
    },
    getFileObjectFromPath: (path) => {
        const fileData = new LocalFileData(path);

        return constructFileFromLocalFileData(fileData);
    }
};

module.exports = {
    settings: contextBridge
};
