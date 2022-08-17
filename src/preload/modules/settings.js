const {
    ipcRenderer,
    webFrame
} = require('electron');
const { LocalFileData, constructFileFromLocalFileData } = require('get-file-object-from-local-path');
const storage = require('electron-json-storage');

const contextBridge = {
    getUserSettings: () => storage.getSync("settings"),
    setUserSettings: (object) => storage.set("settings", object),
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
