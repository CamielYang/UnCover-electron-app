const {
    app,
    BrowserWindow,
    ipcMain,
    globalShortcut,
    nativeTheme,
} = require("electron");
const path = require("path");
const webBrowser = require("./webBrowser/webBrowserMain");

let win;

function createWindow() {
    win = new BrowserWindow({
        frame: false,
        resizable: false,
        autoHideMenuBar: true,
        transparent: true,
        skipTaskbar: true,
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, "../../src/preload/preloadIndex.js"),
        },
    });
    //win.setIgnoreMouseEvents(true, { forward: true });

    let level = "normal";

    //minimizeWindow();
    win.setAlwaysOnTop(true, level);
    win.setFullScreenable(false);
    win.loadFile("src/renderer/index.html");
}

function createShortcuts() {
    // Shortcut display/hide
    globalShortcut.register("Shift+F1", () => {
        win.isMinimized() ? maximizeWindow() : minimizeWindow();
    });
}

function minimizeWindow() {
    win.minimize()
}

function maximizeWindow() {
    win.restore();
}

app.whenReady().then(() => {
    createWindow();
    createShortcuts();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("close-window", (e, ...args) => {
    minimizeWindow();
});


ipcMain.handle("set-ignore-mouse-events", (e, ...args) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    win.setIgnoreMouseEvents(...args);
});


/* BROWSER FUNCTIONS */
ipcMain.handle("open-web-browser", (e, ...args) => {
    webBrowser.openWebBrowser(win);
});

