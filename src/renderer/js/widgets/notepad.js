/**
 * Notepad widget to write simple notes.
 *
 * @param {string} notepadId Id of notepad textarea.
 * @param {string} clearButtonId Id of button to clear the notepad.
 */
export class Notepad {
    constructor(notepadId = "notepad", clearButtonId = "clearNotepad") {
        this.notepadId = document.getElementById(notepadId);
        this.clearButtonId = document.getElementById(clearButtonId);

        this.createClearEvent();
    }

    createClearEvent() {
        this.clearButtonId.addEventListener("click", () => {
            this.notepadId.value = '';
        })
    }
}