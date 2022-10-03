const {
    desktopCapturer,
    ipcRenderer
} = require('electron');

let mediaRecorder;
const recordedChunks = [];

async function startRecording() {
    const sources = await desktopCapturer.getSources({ types: ['screen'] });
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sources[0].id,
              },
            },
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sources[0].id,
              },
            },
        });
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        mediaRecorder.start();
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleStop;
    } catch (e) {
        console.log(e);
    }
}

function handleDataAvailable(e) {
    recordedChunks.push(e.data);
}

async function handleStop() {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });

    const buffer = Buffer.from(await blob.arrayBuffer());
    ipcRenderer.invoke('open-save-dialog', buffer, "recording");
}

function stopRecording() {
    mediaRecorder.stop();
}


const contextBridge = {
    startRecording: () => startRecording(),
    stopRecording: () => stopRecording(),
};

module.exports = {
    screenRecorder: contextBridge
};
