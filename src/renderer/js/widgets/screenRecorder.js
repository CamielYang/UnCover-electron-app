const template = document.createElement('template');
template.innerHTML = `
    <div class="light-container screen-recorder-container">
        <div class="widget-header flex-row space-between">
            <h3>Capture</h3>
            <div class="flex-row flex-buttons">
                <button id="setCapture" class="button button-primary">00:00:00</button>
                <button id="setCapture" class="button button-primary">Start</button>
            </div>
        </div>
        <div class="screen-recorder-content" id="clipboard">
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

        this.noteContainer = this.children[0];

        this.notepadId = this.noteContainer.querySelector("#notepad");
        this.saveButtonId = this.noteContainer.querySelector("#saveNotepad");
        this.clearButtonId = this.noteContainer.querySelector("#clearNotepad");

        this.createEvents();
    }

    createEvents() {
        // Save Notepad content
        this.saveButtonId.addEventListener("click", () => {
            window.api.general.saveDialog(this.notepadId.value, "text");
        });

        // Clear Notepad content
        this.clearButtonId.addEventListener("click", () => {
            this.notepadId.value = '';
        });
    }
}

window.customElements.define('screen-recorder-widget', ScreenRecorder);
