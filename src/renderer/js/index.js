const volumebar =  document.getElementById("volumebar");
const volumeIcon = document.getElementById("volumeIcon");
let value;
let mute;

window.onload = function () {
    startTime();
    getDate();
    updateAllVolume();
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