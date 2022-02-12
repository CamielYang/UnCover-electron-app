// Show modal
let modal = document.getElementById("myModal");
let baseTempPath = "templates/";

// Load modal content by fetching a template
export async function loadModal(file) {  
    let request = await fetch(baseTempPath + file);
    let response = await request.text();

    modal.innerHTML = response;
    
    setModal();
}

export function setModalId(modalId) {
    modal = document.getElementById(modalId);
}

export function setBaseTemplatePath(basePath) {
    baseTempPath = basePath;
}

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