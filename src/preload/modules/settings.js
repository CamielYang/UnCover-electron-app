const {
    ipcRenderer,
    webFrame
} = require('electron');
const storage = require('electron-json-storage');

const contextBridge = {
    getUserSettings: () => storage.getSync("settings"),
    setUserSettings: (object) => storage.set("settings", object),
    getZoomFactor: () => webFrame.getZoomFactor(),
    setZoomFactor: (factor) => webFrame.setZoomFactor(factor),
    setStartupSetting: (bool) => {
        ipcRenderer.invoke('set-startup-setting', bool);
    }
}

module.exports = {
    settings: contextBridge
}
