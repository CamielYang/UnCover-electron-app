const { ipcRenderer } = require('electron');

// Waits until the view is completely loaded
window.addEventListener("DOMContentLoaded", () => {
    
    // Event for closing the main window on click
    document.getElementById("closeWinBtn").addEventListener("click", function() {
        console.log("click");
        ipcRenderer.invoke('close-window', '');
    });

    // Event for opening web browser on click
    document.getElementById("openWebBtn").addEventListener("click", function() {
        console.log("click");
        ipcRenderer.invoke('open-web-browser', '');
    });
});