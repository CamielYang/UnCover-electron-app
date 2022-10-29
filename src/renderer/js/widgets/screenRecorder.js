const template = document.createElement('template');
template.innerHTML = `
    <div class="light-container screen-recorder-container">
        <div class="widget-header flex-row space-between">
            <h3>Capture</h3>
            <div class="flex-row flex-buttons">
                <button id="saveCapture" class="button button-primary">Save</button>
                <button id="setCapture" class="button button-primary">Start</button>
            </div>
        </div>
        <div class="screen-recorder-content" id="clipboard">
            <video src="" controls id="recordedVideo"></video>
            <p class="screen-recorder__text">
                <span class="material-icons screen-recorder__icon" id="recorderIcon">
                    radio_button_checked
                </span>
                <span id="recorderText">No recording</span
            </p>
        </div>
    </div>
`;

/**
 * Screen recorder widget to take clips of your desktop screen.
*/
class ScreenRecorder extends HTMLElement {
    constructor() {
        super();

        this.appendChild(template.content.cloneNode(true));

        this.captureContainer = this.children[0];

        this.captureStarted = false;

        this.recordedIcon = this.captureContainer.querySelector("#recorderIcon");
        this.recordedText = this.captureContainer.querySelector("#recorderText");
        this.recordedVideo = this.captureContainer.querySelector("#recordedVideo");
        this.saveCapture = this.captureContainer.querySelector("#saveCapture");
        this.setCapture = this.captureContainer.querySelector("#setCapture");

        this.createEvents();
    }

    createEvents() {
        this.setCapture.addEventListener("click", () => {
            this.captureStarted ? this.stopCapture() : this.startCapture();
        });

        this.saveCapture.addEventListener("click", () => {
            window.api.screenRecorder.saveRecording();
        });
    }

    startCapture() {
        window.api.screenRecorder.startRecording();

        this.recordedText.innerHTML = "Recording";
        this.recordedIcon.classList.add("is--recording");
        this.recordedVideo.classList.remove("is--visible");
        this.setCapture.innerText = "Stop";

        this.captureStarted = true;
    }

    stopCapture() {
        window.api.screenRecorder.stopRecording(this.recordedVideo);

        this.recordedIcon.classList.remove("is--recording");
        this.setCapture.innerText = "Start";

        this.captureStarted = false;
    }
}

window.customElements.define('screen-recorder-widget', ScreenRecorder);
