import { Modal } from "./modal.js"

export class Clipboard {
    constructor(contentId = "clipboard", clearClipboardId = "clearClipboard") {
        this.contentId = document.getElementById(contentId);
        this.clearClipboardId = document.getElementById(clearClipboardId);

        this.createClearEvent();
        this.createClipboardChangedEvent();

        this.updateClipboard();
    }

    // Event for clearing clipboard
    createClearEvent() {
        this.clearClipboardId.addEventListener("click", () => {
            api.clearClipboard();
        });
    }

    // Update clipboard when clipboard change event is fired
    createClipboardChangedEvent() {
        api.onClipboardChanged('change', () => {
            this.updateClipboard();
        });
    }

    // Update cllipboard content
    updateClipboard() {
        const text = api.readClipboardText();
        const image = api.readClipboardImage();
        
        if (text) {
            this.setClipboardText(text);
        } 
        else if (!api.imageIsEmpty()) {
            this.setClipboardImage(image);
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