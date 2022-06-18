import { Modal } from "./modal.js"

const template = document.createElement('template');
template.innerHTML = `
    <div class="light-container clipboard-container">
        <div class="widget-header flex-row space-between">
            <h3>Clipboard</h3>
            <div class="flex-row flex-buttons">
                <button id="saveClipboard" class="button button-primary">Save</button>
                <button id="clearClipboard" class="button button-primary">Clear</button>
            </div>
        </div>
        <div class="clipboard-content" id="clipboard">
        </div>
    </div>
`;

class Clipboard extends HTMLElement {
    constructor() {
        super()

        this.appendChild(template.content.cloneNode(true));

        this.clipboardContainer = this.children[0];

        this.text;
        this.image;
        this.contentId = this.clipboardContainer.querySelector("#clipboard");
        this.saveClipboardId = this.clipboardContainer.querySelector("#saveClipboard");
        this.clearClipboardId = this.clipboardContainer.querySelector("#clearClipboard");

        this.createEvents();
        this.updateClipboard();
    }

    createEvents() {
        // Save Notepad content
        this.saveClipboardId.addEventListener("click", () => {
            const availableFormats = api.getClipboardAvailableFormats();

            if (availableFormats.includes("text/plain")) {
                api.saveDialog(this.text, "text");
            } 
            else if (availableFormats.includes("image/png") || availableFormats.includes("image/jpg")) {
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
        const availableFormats = api.getClipboardAvailableFormats();

        if (availableFormats.includes("text/plain")) {
            this.text = api.readClipboardText();
            this.setClipboardText(this.text);
        } 
        else if (availableFormats.includes("image/png") || availableFormats.includes("image/jpeg")) {
            this.image = api.readClipboardImage();    
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

window.customElements.define('clipboard-widget', Clipboard);