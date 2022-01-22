const {
    app,
    BrowserWindow,
    ipcMain,
    globalShortcut,
} = require("electron");
const path = require("path");

var win;

function createWindow() {
    win = new BrowserWindow({
        frame: false,
        resizable: false,
        autoHideMenuBar: true,
        transparent: true,
        skipTaskbar: true,
        webPreferences: {
            //preload: path.join(__dirname, "preload.js")
        },
    });
    //win.setIgnoreMouseEvents(true, { forward: true });

    let level = "normal";

    minimizeWindow();
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win.setAlwaysOnTop(true, level);
    win.loadFile("index.html");
}

function createShortcuts() {
    // Shortcut display/hide
    globalShortcut.register("Shift+F1", () => {
        win.isMinimized() ? maximizeWindow() : minimizeWindow();
    });
}

function minimizeWindow() {
    win.maximize();
    win.minimize()
}

function maximizeWindow() {
    win.maximize();
    win.show();
}

app.whenReady().then(() => {
    createWindow();
    createShortcuts();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("set-ignore-mouse-events", (e, ...args) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    win.setIgnoreMouseEvents(...args);
});
