/**
 * Notepad widget to write simple notes.
 *
 * @param {string} notepadId Id of notepad textarea.
 * @param {string} clearButtonId Id of button to clear the notepad.
 */
export class Notepad {
    constructor(notepadId = "notepad", saveButtonId = "saveNotepad", clearButtonId = "clearNotepad") {
        this.notepadId = document.getElementById(notepadId);
        this.saveButtonId = document.getElementById(saveButtonId);
        this.clearButtonId = document.getElementById(clearButtonId);

        this.createEvents()
    }

    createEvents() {
        // Save Notepad content
        this.saveButtonId.addEventListener("click", () => {
            api.saveDialog(this.notepadId.value, "text");
        })

        // Clear Notepad content
        this.clearButtonId.addEventListener("click", () => {
            this.notepadId.value = '';
        })
    }
}