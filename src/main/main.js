const {
    app,
    BrowserWindow,
    ipcMain,
    globalShortcut,
    Tray,
    Menu,
    dialog
} = require("electron");
const fs = require('fs');
const path = require("path");
require("./webBrowser/webBrowserMain");

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
    tray = new Tray(path.join(__dirname, "../../resources/UnCover.ico"));
    
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

function getMainWindow() {
    return win;
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

// Event for opening save dialog
ipcMain.handle("open-save-dialog", (e, content, fileType = "default") => {
    // Json of extensions fore different file types. Chosen extension will be determined by the fileType that is passed
    const extensions = {
        default : [
            { name: 'All Files', extensions: ['*'] }
        ],
        text : [
            { name: 'Text Files', extensions: ['txt', 'docx'] }, 
            { name: 'All Files', extensions: ['*'] }
        ],
        image : [
            {name: 'Images', extensions: ['png', 'jpg']},
        ]
    }; 

    const timestamp = new Date().getTime();
    const setExtension = extensions[fileType];
    // Show the save dialog. The default filename will is: [unixTime]_UnCover.[fileType].
    // Filters expects an array of extensions passed.
    dialog.showSaveDialog(getMainWindow(), {
        defaultPath : `${app.getPath("downloads")}\\${timestamp}_UnCover.${setExtension[0].extensions[0]}`,
        filters: setExtension,
        properties: []
    }).then(file => {
        if (!file.canceled) {
            // Write file to the set path
            fs.writeFile(file.filePath.toString(), 
                content, function (err) {
                if (err) throw err;
            });
        }
    }).catch(err => {
        console.log(err)
    });
});

// ipcMain.handle("set-ignore-mouse-events", (e, ...args) => {
//     const win = BrowserWindow.fromWebContents(e.sender);
//     win.setIgnoreMouseEvents(...args);
// });

exports.getMainWindow = getMainWindow;

