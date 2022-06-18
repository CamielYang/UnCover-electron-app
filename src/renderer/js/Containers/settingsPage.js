const template = document.createElement('template');
template.innerHTML = `
    <div class="settings-page" id="settingsPage">
        <div class="flex-row flex-start header">
            <button id="returnOverlayBtn" class="material-icons icon-button">arrow_back</button>
            <h2>Settings</h2>
        </div>

        <!-- User settings -->
        <div class="light-container settings-container">
            <h2>User settings</h2>
            <div class="setting">
                <h3>Run at startup</h3>
                <label class="switch">
                    <input id="startupCheckbox" type="checkbox">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="setting">
                <h3>Start minimized</h3>
                <label class="switch">
                    <input id="minimizedCheckbox" type="checkbox">
                    <span class="slider"></span>
                </label>
            </div>

            <div class="setting">
                <h3>Scaling</h3>
                <div class="flex-row">
                    <p class="input-info" id="scalingInfo">0%</p>
                    <input type="range" id="scalingInput" min="50" max="150" step="10" value="0">    
                </div>
            </div>
        </div>

        <!-- Display Settings -->
        <div class="light-container settings-container">
            <h2>Display settings</h2>
            <div class="setting">
                <h3>Blur</h3>
                <div class="flex-row">
                    <p class="input-info" id="blurInfo">0px</p>
                    <input type="range" id="blurInput" min="0" max="50" value="0">    
                </div>
            </div>
            <div class="setting">
                <h3>Transparency</h3>
                <div class="flex-row">
                    <p class="input-info" id="transparencyInfo">0%</p>
                    <input type="range" id="transparencyInput" min="0" max="100" value="0">    
                </div>
            </div>
            <div id="imageSetting" class="setting">
                <h3>Enable image</h3>
                <label class="switch">
                    <input id="backgroundImgCheckbox" type="checkbox">
                    <span class="slider"></span>
                </label>
                <div id="imageInputDiv" class="file-input">
                    <label for="backgroundImgInput" class="button button-primary"><strong>Choose an image</strong></label>
                    <input accept="image/*" type="file" id="backgroundImgInput" />
                </div>
            </div>
        </div>
    </div>
`;

export class SettingsPage extends HTMLElement {
    constructor() {
        super()

        this.appendChild(template.content.cloneNode(true));

        this.templateContainer = this.children[0];

        const defaultSettings = {
            runAtStartup: false,
            runMinimized: true,
            zoomFactor: 1,
            blur: "10px",
            backgroundTransparency: "50%",
            enableBackgroundImage: false,
            imageFile: null
        }
        
        let settingsData;

        // User Settings
        const startupCheckbox = document.getElementById("startupCheckbox");
        const minimizedCheckbox = document.getElementById("minimizedCheckbox");
        const scalingInput = document.getElementById("scalingInput");
        const scalingInfo = document.getElementById("scalingInfo");
        
        // Display Settings
        const blurInput = document.getElementById("blurInput");
        const blurInfo = document.getElementById("blurInfo");
        
        const transparencyInput = document.getElementById("transparencyInput");
        const transparencyInfo = document.getElementById("transparencyInfo");
        
        const backgroundImgCheckbox = document.getElementById("backgroundImgCheckbox");
        const backgroundInputDiv = document.getElementById("imageInputDiv");
        const backgroundInput = document.getElementById("backgroundImgInput");
        let autoSaveInterval;
        let backgroundImgFile;

        initializeSettings()

        // Load all settings values
        function initializeSettings() {
            settingsData = getSettingsData();
            
            document.getElementById("settingsBtn").addEventListener("click", showSettings);
            document.getElementById("returnOverlayBtn").addEventListener("click", showOverlay);

            initializeStartup();
            initializeMinimized();
            initializeScaling();
            initializeBlur();
            initializeTransparency();
            initializeBackgroundImg();
        }

        /* STARTUP */
        // Initialize values for startup
        function initializeStartup() {
            const bool = settingsData.runAtStartup
            
            startupCheckbox.addEventListener('change', checkStartup)
            startupCheckbox.checked = bool;
            
            updateStartup(bool);
        }

        function checkStartup(event) {
            const bool = event.target.checked;
            
            settingsData.runAtStartup = bool;

            updateStartup(bool);
        }

        function updateStartup(bool) {
            api.setStartupSetting(bool);
        }


        /* Minimized */
        // Initialize values for minimized
        function initializeMinimized() {
            const bool = settingsData.runMinimized
            
            minimizedCheckbox.addEventListener('change', checkMinimized)
            minimizedCheckbox.checked = bool;
            
            if (!bool) {
                api.openWindow();
            }
        }

        function checkMinimized(event) {
            const bool = event.target.checked;
            
            settingsData.runMinimized = bool;
        }


        /* SCALING */
        // Initialize values for scaling
        function initializeScaling() {
            const value = settingsData.zoomFactor;

            scalingInput.addEventListener("input", checkScaling); 
            scalingInput.value = value * 100;
            
            updateScaling(value * 100);
        }

        // Function for event on transparency slider input
        function checkScaling(event) {      
            settingsData.zoomFactor = event.target.value / 100;
            
            updateScaling(event.target.value);
        }

        // Update scaling. Value expects a percentage
        function updateScaling(value) {
            api.setZoomFactor(value / 100);
            scalingInfo.innerText = `${value}%`;
        }

        /* Blur */
        // Initialize values for container blur
        function initializeBlur() {
            const value = settingsData.blur;

            blurInput.addEventListener("input", checkBlur); 
            blurInput.value = value.replace("px", "");
            
            updateBlur(value);
        }

        // Function for event on blur slider input
        function checkBlur(event) {
            const value = `${event.target.value}px`;

            settingsData.blur = value;    
            updateBlur(value);
        }

        function updateBlur(value) {
            document.documentElement.style.setProperty('--blurRadius', value);
            blurInfo.innerText = value;
        }


        /* TRANPARENCY */
        // Initialize values for background transparency
        function initializeTransparency() {
            const value = settingsData.backgroundTransparency;

            transparencyInput.addEventListener("input", checkTransparency); 
            transparencyInput.value = value.replace("%", "");
            
            updateTransparency(value);
        }

        // Function for event on transparency slider input
        function checkTransparency(event) {
            const value = `${event.target.value}%`;

            settingsData.backgroundTransparency = value;    
            updateTransparency(value);
        }

        function updateTransparency(value) {
            document.documentElement.style.setProperty('--transparency', value);
            transparencyInfo.innerText = value;
        }


        /* BACKGROUND IMAGE */
        // Re-initialize background image settings depending on if the checkbox is checked or not.
        function initializeBackgroundImg() {
            if (settingsData.enableBackgroundImage) {
                backgroundImgCheckbox.checked = true;
                
                backgroundInputDiv.classList.remove("hidden");
                setBackgroundImage(settingsData.imageFile);
            }
            else {
                backgroundImgCheckbox.checked = false;
                
                backgroundInputDiv.classList.add("hidden")
                setBackgroundImage(null);
            }

            backgroundImgCheckbox.addEventListener("change", checkBackgroundImg);
            addBackgroundInputEvent();
        }

        // Listen for change in file input of the background
        function addBackgroundInputEvent() {
            backgroundInput.addEventListener('change', function(e) {
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
                settingsData.imageFile = backgroundImgFile
                setBackgroundImage(backgroundImgFile);
            });
        }

        function checkBackgroundImg(event) {
            if (event.target.checked) {
                settingsData.enableBackgroundImage = true

                backgroundInputDiv.classList.remove("hidden");
                setBackgroundImage(settingsData.imageFile);
            }
            else {
                settingsData.enableBackgroundImage = false

                backgroundInputDiv.classList.add("hidden")
                setBackgroundImage(null);
            }
        }

        function setBackgroundImage(imageFile) {
            document.body.parentElement.style.backgroundImage = imageFile ? `url("${imageFile}")` : "";
        }


        // Reformat path to return usable path for css
        function getPathUrl(filePath) {
            return filePath.replaceAll("\\", "/").replace(/^[^\/]*/, "");
        }
        
        // Display settings page
        function showSettings() {
            overlayPage.style.display = "none"
            settingsPage.style.display = "block"

            // Set auto save every second
            autoSaveInterval = setInterval(() => {
                saveSettings(settingsData);
            }, 1000);
        }
        
        // Display main page
        function showOverlay() {
            overlayPage.style.display = "flex"
            settingsPage.style.display = "none"

            // Stop the auto save interval
            clearInterval(autoSaveInterval);
        }

        // Return settings data
        function getSettingsData() {
            const settings = api.getUserSettings();

            if (Object.keys(settings).length == 0) {
                saveSettings(defaultSettings)
                return defaultSettings
            }
            // Combine default settings and user settings to fill up empty values
            return Object.assign(defaultSettings, settings);
        }

        function saveSettings(object) {
            api.setUserSettings(object)
        }
    }
}

window.customElements.define('settings-page', SettingsPage);