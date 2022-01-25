const {
    app,
    BrowserWindow,
    ipcMain,
    globalShortcut,
    Tray,
    Menu,
} = require("electron");
const path = require("path");
const webBrowser = require("./webBrowser/webBrowserMain");

let win;
let tray;

// Create main window
function createWindow() {
    win = new BrowserWindow({
        title: "UnCover",
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

    minimizeWindow();
    win.setAlwaysOnTop(true, level);
    win.setFullScreenable(false);
    win.loadFile("src/renderer/index.html");
}

// create global shortcuts
function createShortcuts() {
    // Shortcut display/hide
    globalShortcut.register("Shift+F1", () => {
        win.isMinimized() ? maximizeWindow() : minimizeWindow();
    });
}

// Create the tray with a menu template
function createTray() {
    tray = new Tray(path.join(__dirname, "../../resources/electron.png"));
    
    const menu = Menu.buildFromTemplate([ 
        {
            label: 'Show',
            click() { maximizeWindow(); },
            accelerator: "Shift+F1",
        },
        {
            type: 'separator'
        },
        {
          label: 'Quit ' + app.name,
          click() { app.quit(); }
        }
    ]);
    
    tray.setToolTip('UnCover');
    tray.setContextMenu(menu);
}

// Minimize main window
function minimizeWindow() {
    win.minimize()
}

// Maximize main window
function maximizeWindow() {
    win.restore();
}

app.whenReady().then(() => {
    createWindow();
    createShortcuts();
    createTray();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("close-window", (e, ...args) => {
    minimizeWindow();
});


// ipcMain.handle("set-ignore-mouse-events", (e, ...args) => {
//     const win = BrowserWindow.fromWebContents(e.sender);
//     win.setIgnoreMouseEvents(...args);
// });


/* BROWSER FUNCTIONS */
ipcMain.handle("open-web-browser", (e, ...args) => {
    webBrowser.openWebBrowser(win);
});

