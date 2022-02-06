const { 
    contextBridge, 
    ipcRenderer, 
    clipboard, 
} = require('electron');
const loudness = require('loudness')
const clipboardListener = require('clipboard-event');
clipboardListener.startListening();

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
})