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