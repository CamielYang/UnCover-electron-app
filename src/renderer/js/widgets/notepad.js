export class Notepad {
    constructor(notepadId, clearButtonId) {
        this.notepadId = document.getElementById(notepadId) ?? document.getElementById("notepad");
        this.clearButtonId = document.getElementById(clearButtonId) ?? document.getElementById("clearNotepad");

        this.createClearEvent();
    }

    createClearEvent() {
        this.clearButtonId.addEventListener("click", () => {
            this.notepadId.value = '';
        })
    }
}