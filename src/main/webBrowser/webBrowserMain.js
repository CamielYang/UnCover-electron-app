const {
    BrowserWindow,
} = require("electron");

let browser;

function createWebWindow(parent) {
    browser = new BrowserWindow({ 
        title: 'UnCover browser',
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
        browser.show()
    })

    browser.loadFile("src/renderer/components/webBrowser.html");
}

function openWebBrowser(parent) {
    browser ? browser.show() : createWebWindow(parent);
}

exports.openWebBrowser = openWebBrowser;