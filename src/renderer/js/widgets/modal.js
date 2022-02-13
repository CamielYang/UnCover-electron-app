export const Modal = (function() {
    let modal = document.getElementById("myModal");
    let baseTempPath = "templates/";

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
        let request = await fetch(baseTempPath + file);
        let response = await request.text();

        modal.innerHTML = response;
        
        setModal();
    }

    function setModalId(modalId) {
        modal = document.getElementById(modalId);
    }

    function setBaseTemplatePath(basePath) {
        baseTempPath = basePath;
    }

    return {
        loadModal,
        setModalId,
        setBaseTemplatePath
    }
})();