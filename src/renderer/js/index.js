const volumebar =  document.getElementById("volumebar");

window.onload = function () {
    startTime();
    getDate();
    getVolume();
}

/* DATE AND TIME */ 
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

function checkTime(i) {
    // add zero in front of numbers < 10
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getDate() {
    const today = new Date();
    const locale = 'en-US';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    document.getElementById("date").innerText = today.toLocaleDateString(locale, options);
}


/* VOLUME CONTROL */ 
async function getVolume() {
    const value = await api.getVolume();

    updateVolumeText(value);
    volumebar.value = value;
    updateVolumeIcon(value);

    setTimeout(getVolume, 500);
}

function updateVolumeText(value) {
    document.getElementById("volume").innerText = value;
}

volumebar.addEventListener("input", async function() {
    let value = volumebar.value;

    updateVolumeText(value);
    await api.setVolume(value);
});

function updateVolumeIcon(value) {
    const volumeIcon = document.getElementById("volumeIcon");

    switch (true) {
        case (value == 0):
            volumeIcon.innerText = 'volume_off';
            break;
        case (value < 25):
            volumeIcon.innerText = 'volume_mute';
            break;
        case (value < 70):
            volumeIcon.innerText = 'volume_down';
            break;
        case (value < 100):
            volumeIcon.innerText = 'volume_up';
            break;
        default:
            volumeIcon.innerText = 'volume_up';
            break;
    }
}


/* NOTEPAD */ 
// Event for clearing the notepad on click
document.getElementById("clearNotepad").addEventListener("click", function() {
    document.getElementById('notepad').value = '';
});