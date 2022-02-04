const { contextBridge, ipcRenderer, clipboard } = require('electron');
const loudness = require('loudness')

let currentImage = "";
let currentText = "";

// Waits until the view is completely loaded
window.addEventListener("DOMContentLoaded", () => {    
    const modal = document.getElementById("myModal");
    const contentDiv = document.getElementById("clipboard");

    window.onload = function () {
        updateClipboard();
    }

    // Clipboard
    // Event for clearing clipboard
    document.getElementById("clearClipboard").addEventListener("click", function() {
        clipboard.clear();
    });

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

        setTimeout(updateClipboard, 1000);
    }

    function setClipboardImage(image) {
        if (currentImage != image.toDataURL()) {
            const modal = document.getElementById("modalImage");
            currentImage = image.toDataURL();
            contentDiv.innerHTML = `<img class="clipboard-image" id="clipboardImg" src="${currentImage}">`;
            modal.src = currentImage;
            
            const clipboardImage = document.getElementById("clipboardImg");
            clipboardImage.onclick = function() {
                setModal();
            }
        }
    }

    function setClipboardText(text) {
        if (ignoreLineBreaks(currentText) != ignoreLineBreaks(text)) {
            currentText = text;
            contentDiv.innerHTML = `
            <div class="clipboard-text">
                <p >${escapeHtml(text)}</p>
            </div>`;
        }
    }

    function setClipboardEmpty() {
        contentDiv.innerHTML = `
        <p class="clipboard-empty">
            Clipboard is empty
        </p>`;
    }
    
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
    
    function ignoreLineBreaks(text) {
        return text.replace(/(\r\n|\n|\r)/gm, "")
    }
    
    
    /* MODAL FUNCTIONS */
    function setModal() {
        modal.style.display = "block";
    }
    
    function unsetModal() {
        modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            unsetModal();
        }
    }
    
    async function loadModal(file) {
        let request = await fetch(file);
        let response = await request.text();
        document.getElementById("myModal").innerHTML = response;
    
        setModal();
    }
    
    // Image modal
    function loadImageModal() {
        loadModal(tempPath + "imageModal.html");
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