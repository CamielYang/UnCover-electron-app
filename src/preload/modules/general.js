
const { ipcRenderer } = require('electron');

async function saveDialog(content, fileType) {
    ipcRenderer.invoke('open-save-dialog', content, fileType);
}

const contextBridge = {
    openWindow: () => ipcRenderer.invoke('open-window', ''),
    saveDialog: (content, fileType) => saveDialog(content, fileType),
};

module.exports = {
    general: contextBridge
};
