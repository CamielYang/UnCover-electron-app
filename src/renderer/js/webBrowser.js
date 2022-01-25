const back = document.getElementById('backBtn');
const forward = document.getElementById('forwardBtn');
const reload = document.getElementById('reloadBtn');
const home = document.getElementById('homeBtn');
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

// Event on address bar
address.addEventListener("keydown", function(event) {
    if (event.key === 'Enter') {
        loadURL(address.value);
    }
});

// Event on webview page load
webview.addEventListener('load-commit', (e) => {
    updateAddressBar(webview.getURL())
})

// Update AddressBar text value
function updateAddressBar(url) {
    address.value = url;
}

// Load the url in the webview after checked the url
function loadURL(url) {
    const newUrl = checkURL(url);
    webview.loadURL(newUrl);

    return newUrl;
}

// Check url for save for secure address
function checkURL(url) {
    if(url.toLowerCase().startsWith('https://www.')) {
        return url;
    }
    return 'https://' + url;
}