import { PageHandler } from "../helpers/pageHandler.js";
import { convertPathUrl } from "../helpers/convertPathUrl.js";

const pageId = "settingsPage";

const template = document.createElement('template');
template.innerHTML = `
    <div class="page" id=${pageId}>
        <div class="flex-row flex-start header">
            <button id="returnOverlayBtn" class="material-icons icon-button">arrow_back</button>
            <h2 class="return-head">Settings</h2>
        </div>

        <!-- User settings -->
        <div class="light-container page-container">
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
        <div class="light-container page-container">
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
                <div id="imageInputDiv" class="file-input m-top">
                    <label for="backgroundImgInput" class="button button-primary"><strong>Choose an image</strong></label>
                    <input accept="image/*" type="file" id="backgroundImgInput" />
                </div>
            </div>
        </div>
    </div>
`;

export class Settings extends HTMLElement {
    constructor() {
        super()

        this.appendChild(template.content.cloneNode(true));

        this.settingsContainer = this.children[0];

        this.defaultSettings = {
            runAtStartup: false,
            runMinimized: true,
            zoomFactor: 1,
            blur: "10px",
            backgroundTransparency: "50%",
            enableBackgroundImage: false,
            imageFile: null
        }

        this.settingsData;

        // User Settings
        this.startupCheckbox = this.settingsContainer.querySelector("#startupCheckbox");
        this.minimizedCheckbox = this.settingsContainer.querySelector("#minimizedCheckbox");
        this.scalingInput = this.settingsContainer.querySelector("#scalingInput");
        this.scalingInfo = this.settingsContainer.querySelector("#scalingInfo");

        // Display Settings
        this.blurInput = this.settingsContainer.querySelector("#blurInput");
        this.blurInfo = this.settingsContainer.querySelector("#blurInfo");

        this.transparencyInput = this.settingsContainer.querySelector("#transparencyInput");
        this.transparencyInfo = this.settingsContainer.querySelector("#transparencyInfo");

        this.backgroundImgCheckbox = this.settingsContainer.querySelector("#backgroundImgCheckbox");
        this.backgroundInputDiv = this.settingsContainer.querySelector("#imageInputDiv");
        this.backgroundInput = this.settingsContainer.querySelector("#backgroundImgInput");
        this.autoSaveInterval;

        this.initializeSettings();
    }

    // Load all settings values
    initializeSettings() {
        this.settingsData = this.getSettingsData();
        document.getElementById("settingsBtn").addEventListener("click", this.showSettings.bind(this));
        this.settingsContainer.querySelector("#returnOverlayBtn").addEventListener("click", this.showOverlay.bind(this));

        this.initializeStartup();
        this.initializeMinimized();
        this.initializeScaling();
        this.initializeBlur();
        this.initializeTransparency();
        this.initializeBackgroundImg();
    }

    /* STARTUP */
    // Initialize values for startup
    initializeStartup() {
        const bool = this.settingsData.runAtStartup

        this.startupCheckbox.addEventListener('change', this.checkStartup.bind(this))
        this.startupCheckbox.checked = bool;

        this.updateStartup(bool);
    }

    checkStartup(event) {
        const bool = event.target.checked;

        this.settingsData.runAtStartup = bool;

        this.updateStartup(bool);
    }

    updateStartup(bool) {
        window.api.settings.setStartupSetting(bool);
    }


    /* Minimized */
    // Initialize values for minimized
    initializeMinimized() {
        const bool = this.settingsData.runMinimized

        this.minimizedCheckbox.addEventListener('change', this.checkMinimized.bind(this))
        this.minimizedCheckbox.checked = bool;

        if (!bool) {
            window.api.general.openWindow();
        }
    }

    checkMinimized(event) {
        const bool = event.target.checked;

        this.settingsData.runMinimized = bool;
    }


    /* SCALING */
    // Initialize values for scaling
    initializeScaling() {
        const value = this.settingsData.zoomFactor;

        this.scalingInput.addEventListener("input", this.checkScaling.bind(this));
        this.scalingInput.value = value * 100;

        this.updateScaling(value * 100);
    }

    // for event on transparency slider input
    checkScaling(event) {
        this.settingsData.zoomFactor = event.target.value / 100;

        this.updateScaling(event.target.value);
    }

    // Update scaling. Value expects a percentage
    updateScaling(value) {
        window.api.settings.setZoomFactor(value / 100);
        this.scalingInfo.innerText = `${value}%`;
    }

    /* Blur */
    // Initialize values for container blur
    initializeBlur() {
        const value = this.settingsData.blur;

        this.blurInput.addEventListener("input", this.checkBlur.bind(this));
        this.blurInput.value = value.replace("px", "");

        this.updateBlur(value);
    }

    // for event on blur slider input
    checkBlur(event) {
        const value = `${event.target.value}px`;

        this.settingsData.blur = value;
        this.updateBlur(value);
    }

    updateBlur(value) {
        document.documentElement.style.setProperty('--blurRadius', value);
        this.blurInfo.innerText = value;
    }


    /* TRANPARENCY */
    // Initialize values for background transparency
    initializeTransparency() {
        const value = this.settingsData.backgroundTransparency;

        this.transparencyInput.addEventListener("input", this.checkTransparency.bind(this));
        this.transparencyInput.value = value.replace("%", "");

        this.updateTransparency(value);
    }

    // for event on transparency slider input
    checkTransparency(event) {
        const value = `${event.target.value}%`;

        this.settingsData.backgroundTransparency = value;
        this.updateTransparency(value);
    }

    updateTransparency(value) {
        document.documentElement.style.setProperty('--transparency', value);
        this.transparencyInfo.innerText = value;
    }


    /* BACKGROUND IMAGE */
    // Re-initialize background image settings depending on if the checkbox is checked or not.
    initializeBackgroundImg() {
        if (this.settingsData.enableBackgroundImage) {
            this.backgroundImgCheckbox.checked = true;

            this.backgroundInputDiv.classList.remove("hidden");
            this.setBackgroundImage(this.settingsData.imageFile);
        }
        else {
            this.backgroundImgCheckbox.checked = false;

            this.backgroundInputDiv.classList.add("hidden")
            this.setBackgroundImage(null);
        }

        this.backgroundImgCheckbox.addEventListener("change", this.checkBackgroundImg.bind(this));
        this.addBackgroundInputEvent();
    }

    // Listen for change in file input of the background
    addBackgroundInputEvent() {
        this.backgroundInput.addEventListener('change', function(e) {
            // Convert image file to base64 string
            // const file = this.files[0];
            // const reader = new FileReader();

            // reader.addEventListener("load", () {
            //     backgroundImgFile = reader.result;
            //     document.body.parentElement.style.backgroundImage = `url("${backgroundImgFile}")`;
            // }, false);

            // if (file) {
            //     reader.readAsDataURL(file);
            // }

            // Use image path location
            const backgroundImgFile = convertPathUrl(e.target.files[0]?.path);

            if (backgroundImgFile) {
                this.settingsData.imageFile = backgroundImgFile;
                this.setBackgroundImage(backgroundImgFile);
            }
        }.bind(this));
    }

    checkBackgroundImg(event) {
        if (event.target.checked) {
            this.settingsData.enableBackgroundImage = true

            this.backgroundInputDiv.classList.remove("hidden");
            this.setBackgroundImage(this.settingsData.imageFile);
        }
        else {
            this.settingsData.enableBackgroundImage = false

            this.backgroundInputDiv.classList.add("hidden")
            this.setBackgroundImage(null);
        }
    }

    setBackgroundImage(imageFile) {
        document.body.parentElement.style.backgroundImage = imageFile ? `url("${imageFile}")` : "";
    }

    // Display settings page
    showSettings() {
        PageHandler.switchPage(pageId);

        // Set auto save every second
        this.autoSaveInterval = setInterval(() => {
            this.saveSettings(this.settingsData);
        }, 1000);
    }

    // Display main page
    showOverlay() {
        PageHandler.switchToMainPage();
        this.saveSettings(this.settingsData);

        // Stop the auto save interval
        clearInterval(this.autoSaveInterval);
    }

    // Return settings data
    getSettingsData() {
        const settings = window.api.settings.getUserSettings();

        if (Object.keys(settings).length == 0) {
            this.saveSettings(this.defaultSettings)
            return this.defaultSettings;
        }
        // Combine default settings and user settings to fill up empty values
        return Object.assign(this.defaultSettings, settings);
    }

    saveSettings(object) {
        window.api.settings.setUserSettings(object);
    }
}

window.customElements.define('settings-page', Settings);
