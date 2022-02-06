const volumebar =  document.getElementById("volumebar");
const volumeIcon = document.getElementById("volumeIcon");
const modal = document.getElementById("myModal");
const contentDiv = document.getElementById("clipboard");
const tempPath = "templates/";
let value;
let mute;

window.onload = function () {
    startTime();
    getDate();
    updateAllVolume();
    updateClipboard();
}

/* DATE AND TIME */
// Update time every second
function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    m = checkTime(m);
    s = checkTime(s);
    document.getElementById("time").innerHTML = h + ":" + m + ":" + s;

    setTimeout(startTime, 1000);
}

// Return right format
function checkTime(i) {
    // add zero in front of numbers < 10
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// get current date
function getDate() {
    const today = new Date();
    const locale = 'en-US';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    document.getElementById("date").innerText = today.toLocaleDateString(locale, options);
}


/* VOLUME CONTROL */ 
// Update the text that represents the volume level
function updateVolumeText(value) {
    document.getElementById("volume").innerText = value;
}

// Set volume icon by icon name
function setVolumeIcon(iconName) {
    volumeIcon.innerText = iconName;
}

// Update everything related to volume
async function updateAllVolume() {
    value = await api.getVolume();
    mute = await api.getMuted();

    updateVolumeText(value);
    volumebar.value = value;
    updateVolumeIcon(value, mute)

    setTimeout(updateAllVolume, 2000);
}

// Event for updating audio level on slider value
volumebar.addEventListener("input", async function() {
    mute = false;
    value = volumebar.value;
    
    updateVolumeText(value);
    updateVolumeIcon(value);

    await api.setVolume(value);
    await api.setMuted(mute);
});

// Event for toggling mute
volumeIcon.addEventListener("click", async function() {
    mute = !mute;

    updateVolumeIcon(value, mute);
    
    await api.setMuted(mute);
});

// Update icon based on it's value
function updateVolumeIcon(value, mute) {    
    switch (!mute) {
        case (value <= 0):
            setVolumeIcon('volume_off');
            break;
        case (value < 25):
            setVolumeIcon('volume_mute');
            break;
        case (value < 70):
            setVolumeIcon('volume_down');
            break;
        case (value <= 100):
            setVolumeIcon('volume_up');
            break;
        default:
            setVolumeIcon('volume_off');
            break;
    }
}


/* NOTEPAD */ 
// Event for clearing the notepad on click
document.getElementById("clearNotepad").addEventListener("click", function() {
    document.getElementById('notepad').value = '';
});


/* Clipboard */
// Event for clearing clipboard
document.getElementById("clearClipboard").addEventListener("click", function() {
    api.clearClipboard();
});

// Update clipboard when clipboard change event is fired
api.onClipboardChanged('change', () => {
    updateClipboard();
});

// Update cllipboard content
function updateClipboard() {
    const text = api.readClipboardText();
    const image = api.readClipboardImage();
    
    if (text) {
        setClipboardText(text);
    } 
    else if (!api.imageIsEmpty()) {
        setClipboardImage(image);
    } 
    else {
        setClipboardEmpty();
    }
}

// Set the image in the clipboard content
function setClipboardImage(image) {
    contentDiv.innerHTML = `<img class="clipboard-image" id="clipboardImg" src="${image}">`;
    
    const clipboardImage = document.getElementById("clipboardImg");
    clipboardImage.onclick = function() {
        loadImageModal(image);
    }
}

// Set the text in the clipboard content
function setClipboardText(text) {
    contentDiv.innerHTML = `
    <div class="clipboard-text">
        <p >${escapeHtml(text)}</p>
    </div>`;
}

// Default empty clipboard
function setClipboardEmpty() {
    contentDiv.innerHTML = `
    <p class="clipboard-empty">
        Clipboard is empty
    </p>`;
}

// Convert plain html to html entities to prevent xss injection and html interruption
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}  

/* MODAL FUNCTIONS */
// Show modal
function setModal() {
    modal.classList.remove("hidden");
}

// Hide modal
function unsetModal() {
    modal.classList.add("hidden");
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        unsetModal();
    }
}

// Load modal content by fetching a template
async function loadModal(file) {  
    let request = await fetch(tempPath + file);
    let response = await request.text();

    document.getElementById("myModal").innerHTML = response;
    
    setModal();
}

// Load modal that previews the image
async function loadImageModal(image) {
    await loadModal("imageModal.html");
    
    const modal = document.getElementById("modalImage");
    modal.src = image;
}