const {
    app,
    BrowserWindow,
    ipcMain,
    globalShortcut,
} = require("electron");
const path = require("path");

let win;
let browser;

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

function createWebWindow() {
    browser = new BrowserWindow({ 
        width: 800,
        height: 500,
        parent: win, 
        show: false,
        autoHideMenuBar: true,
    })
    browser.on('closed', () => {
        browser = null
    })
    
    browser.loadURL('https://www.google.com')
    browser.once('ready-to-show', () => {
        browser.show()
    })
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

function openWebBrowser() {
    browser ? browser.show() : createWebWindow();
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

ipcMain.handle("close-window", (e, ...args) => {
    minimizeWindow();
});

ipcMain.handle("open-web-browser", (e, ...args) => {
    openWebBrowser();
});