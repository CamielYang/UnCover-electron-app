import { Modal } from "./modal.js"

export class Clipboard {
    text;
    image;

    constructor(contentId = "clipboard", saveClipboardId = "saveClipboard", clearClipboardId = "clearClipboard") {
        this.contentId = document.getElementById(contentId);
        this.saveClipboardId = document.getElementById(saveClipboardId);
        this.clearClipboardId = document.getElementById(clearClipboardId);

        this.createEvents();
        this.updateClipboard();
    }

    createEvents() {
        // Save Notepad content
        this.saveClipboardId.addEventListener("click", () => {
            if (this.text) {
                api.saveDialog(this.text, "text");
            } 
            else if (!api.imageIsEmpty()) {
                api.saveDialog(api.removeImageUrlPrefix(this.image), "image");
            } 
        })
        
        // Event for clearing clipboard
        this.clearClipboardId.addEventListener("click", () => {
            api.clearClipboard();
        });

        // Update clipboard when clipboard change event is fired
        api.onClipboardChanged('change', () => {
            this.updateClipboard();
        });
    }

    // Update cllipboard content
    updateClipboard() {        
        this.text = api.readClipboardText();
        this.image = api.readClipboardImage();
        
        if (this.text) {
            this.setClipboardText(this.text);
        } 
        else if (!api.imageIsEmpty()) {
            this.setClipboardImage(this.image);
        } 
        else {
            this.setClipboardEmpty();
        }
    }

    // Set the image in the clipboard content
    setClipboardImage(image) {
        this.contentId.innerHTML = `<img class="clipboard-image" id="clipboardImg" src="${image}">`;
        
        const clipboardImage = document.getElementById("clipboardImg");
        clipboardImage.onclick = () => {
            this.loadImageModal(image);
        }
    }

    // Set the text in the clipboard content
    setClipboardText(text) {
        this.contentId.innerHTML = `
        <div class="clipboard-text">
            <p >${Clipboard.escapeHtml(text)}</p>
        </div>`;
    }

    // Default empty clipboard
    setClipboardEmpty() {
        this.contentId.innerHTML = `
        <p class="clipboard-empty">
            Clipboard is empty
        </p>`;
    }

    // Convert plain html to html entities to prevent xss injection and html interruption
    static escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }  

    // Load modal that previews the image
    async loadImageModal(image) {
        await Modal.loadModal("imageModal.html");
        
        const modal = document.getElementById("modalImage");
        modal.src = image;
    }
}