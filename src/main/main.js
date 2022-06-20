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
        alwaysOnTop: true,
        show: false,
        fullscreen: true,
        webPreferences: {
            preload: path.join(__dirname, "../../src/preload/preloadIndex.js"),
        },
    });
    //win.setIgnoreMouseEvents(true, { forward: true });

    let level = "normal";

    win.setAlwaysOnTop(true, level);
    win.loadFile("src/renderer/index.html");
    
    const splash = new BrowserWindow({
        width: 256, 
        height: 256, 
        transparent: true, 
        frame: false, 
        center: true,
        resizable: false,
        autoHideMenuBar: true,
        skipTaskbar: true,
        alwaysOnTop: true
    });

    splash.setIgnoreMouseEvents(true)
    splash.loadFile('src/renderer/splash.html');

    win.once('ready-to-show', () => {
        splash.close();
        createShortcuts();
        createTray();
    })
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
    win.setFullScreen(true);
    win.show();
}

function getMainWindow() {
    return win;
}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

ipcMain.handle("close-window", (e, ...args) => {
    minimizeWindow();
});

ipcMain.handle("open-window", (e, ...args) => {
    maximizeWindow();
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

ipcMain.handle('set-startup-setting', (e, bool = false) => {
    if (!app.getLoginItemSettings().openAtLogin == bool) {
        app.setLoginItemSettings({ openAtLogin: bool });
    }
});

ipcMain.handle('get-user-data-path', () => app.getPath("userData"));

ipcMain.handle('get-file-icon', (e, path) => {
    return app.getFileIcon(path, { size: "large" }).then(icon => icon.toDataURL());
});

// ipcMain.handle("set-ignore-mouse-events", (e, ...args) => {
//     const win = BrowserWindow.fromWebContents(e.sender);
//     win.setIgnoreMouseEvents(...args);
// });

exports.getMainWindow = getMainWindow;

