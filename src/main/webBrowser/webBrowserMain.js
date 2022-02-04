const {
    BrowserWindow,
    ipcMain,
} = require("electron");
const main = require("../main");

let browser;
var parent;

function createWebWindow() {
    parent = main.getMainWindow();

    browser = new BrowserWindow({ 
        title: 'UnCover Browser',
        width: 800,
        height: 500,
        minWidth: 500,
        minHeight: 100,
        parent: parent, 
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            webviewTag: true,
        }
    })
    
    browser.on('closed', () => {
        browser = null;
    })

    browser.once('ready-to-show', () => {
        browser.show();
    })

    browser.webContents.on('did-attach-webview', (e, content) => {
        content.setWindowOpenHandler(({ url }) => {
            createNewWindow(url);
            return { action: 'deny' }
        })
    })

    browser.loadFile("src/renderer/components/webBrowser.html");
}

function createNewWindow(url) {
    const newWindow = new BrowserWindow({ 
        width: 800,
        height: 500,
        parent: parent,
        minWidth: 500,
        minHeight: 100,
        show: false,
        autoHideMenuBar: true,
    })


    newWindow.once('ready-to-show', () => {
        newWindow.show()
    })

    newWindow.loadURL(url);
}

function openWebBrowser() {
    browser ? browser.show() : createWebWindow();
}

ipcMain.handle("open-web-browser", (e, ...args) => {
    openWebBrowser();
});