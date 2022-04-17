import { Modal } from "./widgets/modal.js";
import { TimeDate } from  "./widgets/timeDate.js";
import { SystemVolume } from  "./widgets/systemVolume.js";
import { Weather } from "./widgets/weather.js";
import { Notepad } from "./widgets/notepad.js";
import { Clipboard } from "./widgets/clipboard.js";
import { Stopwatch } from "./widgets/stopwatch.js";
import { Performance } from "./widgets/performance.js";


// Modal
Modal.setModalId("myModal");
Modal.setBaseTemplatePath("templates/");

// Settings functions
window.onload = () => {
    const overlay = document.getElementById("overlayPage");
    const settings = document.getElementById("settingsPage");

    // Background Settings
    const enableBackgroundImg = document.getElementById("enableBackgroundImg");
    const backgroundInputDiv = document.getElementById("imageInputDiv");
    const backgroundInputId = "backgroundImgInput";
    let backgroundImgFile;
    
    initializeSettings()

    // Load all settings values
    function initializeSettings() {
        addSettingsEvents();

        initializeTransparancy();
        initializeBackgroundImg();
    }


    function addSettingsEvents() {
        document.getElementById("settingsBtn").addEventListener("click", showSettings);
        document.getElementById("returnOverlayBtn").addEventListener("click", showOverlay);

        enableBackgroundImg.addEventListener("change", initializeBackgroundImg);
        addBackgroundInputEvent();
    }

    function addBackgroundInputEvent() {
        document.getElementById(backgroundInputId).addEventListener('change', function(e) {
            // Convert image file to base64 string
            // const file = this.files[0];
            // const reader = new FileReader();

            // reader.addEventListener("load", function () {
            //     backgroundImgFile = reader.result;
            //     document.body.parentElement.style.backgroundImage = `url("${backgroundImgFile}")`;
            // }, false);
        
            // if (file) {
            //     reader.readAsDataURL(file);
            // }

            // Use image path location
            backgroundImgFile = getPathUrl(this.files[0].path);
            document.body.parentElement.style.backgroundImage = `url("${backgroundImgFile}")`;
        });
    }

    // Initialize values for background transparency
    function initializeTransparancy() {
        const value = getComputedStyle(document.documentElement).getPropertyValue('--transparency');
        
        document.getElementById("transparencyInput").addEventListener("input", updateTransparancy); 

        document.getElementById("transparencyInput").value = value.replace("%", "").trim();
        document.getElementById("transparencyInfo").innerText = value;
    }

    // Function for event on transparency slider input
    function updateTransparancy(event) {
        document.documentElement.style.setProperty('--transparency', `${event.target.value}%`);
        document.getElementById("transparencyInfo").innerText = `${event.target.value}%`;
    }

    // Re-initialize background image settings depending on if the checkbox is checked or not.
    function initializeBackgroundImg() {
        if (enableBackgroundImg.checked) {
            backgroundInputDiv.classList.remove("hidden")

            if (backgroundImgFile) {
                document.body.parentElement.style.backgroundImage = `url("${backgroundImgFile}")`;
            }
        }
        else {
            backgroundInputDiv.classList.add("hidden")
            document.body.parentElement.style.backgroundImage = "";
        }
    }

    // Reformat path to return usable path for css
    function getPathUrl(filePath) {
        return filePath.replaceAll("\\", "/").replace(/^[^\/]*/, "");
    }
    
    // Display settings page
    function showSettings() {
        overlay.style.display = "none"
        settings.style.display = "block"
    }
    
    // Display main page
    function showOverlay() {
        overlay.style.display = "flex"
        settings.style.display = "none"
    }
}