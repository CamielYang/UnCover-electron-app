const { contextBridge, ipcRenderer, clipboard } = require('electron');
const loudness = require('loudness')
const clipboardListener = require('clipboard-event');
clipboardListener.startListening();

// Waits until the view is completely loaded
window.addEventListener("DOMContentLoaded", () => {    
    const modal = document.getElementById("myModal");
    const contentDiv = document.getElementById("clipboard");
    const tempPath = "templates/";

    window.onload = () => {
        updateClipboard();
    }
    
    /* CLIPBOARD FUNTIONS */
    // Event for clearing clipboard
    document.getElementById("clearClipboard").addEventListener("click", function() {
        clipboard.clear();
    });
    
    // Update clipboard when clipboard change event is fired
    clipboardListener.on('change', () => {
        updateClipboard();
    });

    // Update cllipboard content
    function updateClipboard() {
        const text = clipboard.readText();
        const image = clipboard.readImage();
    
        if (text) {
            setClipboardText(text);
        } 
        else if (!image.isEmpty()) {
            setClipboardImage(image);
        } 
        else {
            setClipboardEmpty();
        }
    }

    // Set the image in the clipboard content
    function setClipboardImage(image) {
        const imageUrl = image.toDataURL();
        contentDiv.innerHTML = `<img class="clipboard-image" id="clipboardImg" src="${imageUrl}">`;
        
        const clipboardImage = document.getElementById("clipboardImg");
        clipboardImage.onclick = function() {
            loadImageModal(imageUrl);
        }
    }

    // Set the text in the clipboard content
    function setClipboardText(text) {
        contentDiv.innerHTML = `
        <div class="clipboard-text">
            <p >${escapeHtml(text)}</p>
        </div>`;
    }

    // Default empty clipboard
    function setClipboardEmpty() {
        contentDiv.innerHTML = `
        <p class="clipboard-empty">
            Clipboard is empty
        </p>`;
    }
    
    // Convert plain html to html entities to prevent xss injection and html interruption
    function escapeHtml(text) {
        var map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        };
        
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }   
    
    /* MODAL FUNCTIONS */
    // Show modal
    function setModal() {
        modal.classList.remove("hidden");
    }
    
    // Hide modal
    function unsetModal() {
        modal.classList.add("hidden");
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            unsetModal();
        }
    }
    
    // Load modal content by fetching a template
    async function loadModal(file) {  
        let request = await fetch(tempPath + file);
        let response = await request.text();
        document.getElementById("myModal").innerHTML = response;
        
        setModal();
    }
    
    // Load modal that previews the image
    async function loadImageModal(image) {
        await loadModal("imageModal.html");
        
        const modal = document.getElementById("modalImage");
        modal.src = image;
    }

    /* ipcRenderers */
    // Event for closing the main window on click
    document.getElementById("closeWinBtn").addEventListener("click", function() {
        ipcRenderer.invoke('close-window', '');
    });

    // Event for opening web browser on click
    document.getElementById("openWebBtn").addEventListener("click", function() {
        ipcRenderer.invoke('open-web-browser', '');
    });
});

contextBridge.exposeInMainWorld("api", {
    getVolume: () => loudness.getVolume(),
    setVolume: (value) => loudness.setVolume(value),
    getMuted: () => loudness.getMuted(),
    setMuted: (bool) => loudness.setMuted(bool),
})