import "../css/webBrowser.css";

const back = document.getElementById('backBtn');
const forward = document.getElementById('forwardBtn');
const reload = document.getElementById('reloadBtn');
const home = document.getElementById('homeBtn');
const pictureInPicture = document.getElementById('pictureInPictureBtn');
const address = document.getElementById('addressBar');
const webview = document.querySelector('webview');

const homeUrl = "https://www.google.com";

// Event on back button
back.addEventListener('click', function() {
    webview.goBack();
});

// Event on forward button
forward.addEventListener('click', function() {
    webview.goForward();
});

// Event on reload button
reload.addEventListener('click', function() {
    webview.reload();
});

// Event on home button
home.addEventListener('click', function() {
    loadURL(homeUrl);
});

// Event on picture-in-picture button
pictureInPicture.addEventListener('click', function() {
    webview.send("picture-in-picture");
});

// Event on address bar
address.addEventListener("keydown", function(event) {
    if (event.key === 'Enter') {
        loadURL(address.value);
    }
});

// Event on webview page load
webview.addEventListener('load-commit', () => {
    updateAddressBar(webview.getURL());
    updateNavbar();
});

// Update AddressBar text value
function updateAddressBar(url) {
    address.value = url;
}

function updateNavbar() {
    back.disabled = webview.canGoBack() ? false : true;
    forward.disabled = webview.canGoForward() ? false : true;
}

// Load the url in the webview after checked the url
function loadURL(url) {
    const newUrl = checkURL(url);
    webview.loadURL(newUrl);
}

// Check url for save for secure address protocol
function checkURL(url) {
    const search = url.match(/^(.*?:\/\/)?(www\.)?(.*)?\/?(.)*$/)[3];

    if (!search.includes(".")) {
        return `https://www.google.com/search?q=${search}`;
    }

    return 'https://' + search;
}
