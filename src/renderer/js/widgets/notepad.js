const template = document.createElement('template');
template.innerHTML = `
    <div class="light-container note-container">
        <div class="widget-header flex-row space-between">
            <h3>Notes</h3>
            <div class="flex-row flex-buttons">
                <button id="saveNotepad" class="button button-primary">Save</button>
                <button id="clearNotepad" class="button button-primary">Clear</button>
            </div>
        </div>
        <textarea id="notepad" cols="30" rows="8"></textarea>
    </div>
`;

/**
 * Notepad widget to write simple notes.
*/
class Notepad extends HTMLElement {
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

window.customElements.define('note-widget', Notepad);
