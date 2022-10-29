const {
    desktopCapturer,
    ipcRenderer
} = require('electron');

// https://github.com/muaz-khan/RecordRTC
// getSeekableBlob
let mediaRecorder;
let videoElement;
const recordedChunks = [];
let blob;

async function startRecording() {
    recordedChunks.length = 0;
    blob = null;
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
    blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });

    videoElement.src = URL.createObjectURL(blob);
	videoElement.load();
	videoElement.onloadeddata = function() {
        videoElement.classList.add("is--visible");
		videoElement.play();
	};
}

async function saveRecording() {
    if (blob) {
        const buffer = Buffer.from(await blob.arrayBuffer());
        ipcRenderer.invoke('open-save-dialog', buffer, "recording");
    }
}

function stopRecording(recordedVideo) {
    videoElement = recordedVideo;
    mediaRecorder.stop();
}


const contextBridge = {
    startRecording: () => startRecording(),
    stopRecording: (recordedVideo) => stopRecording(recordedVideo),
    saveRecording: () => saveRecording()
};

module.exports = {
    screenRecorder: contextBridge
};
