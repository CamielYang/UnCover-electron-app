const template = document.createElement('template');
template.innerHTML = `
    <div class="light-container volume-container">
        <button class="material-icons icon-button" id="volumeIcon">volume_up</button>
        <input type="range" id="volumebar" min="1" max="100" value="0">
        <p id="volume">0</p>
    </div>
`;

/**
 * Volume widget to manage system volume. You can mute or change the system volume value.
 */
class SystemVolume extends HTMLElement {
    constructor() {
        super()

        this.appendChild(template.content.cloneNode(true));

        this.volumeContainer = this.children[0];
        this.volumebarId = this.volumeContainer.querySelector("#volumebar");
        this.volumeIconId = this.volumeContainer.querySelector("#volumeIcon");
        this.volumeId = this.volumeContainer.querySelector("#volume");

        this.createSliderEvent();
        this.createMuteEvent();
        this.updateAllVolume();
    }

    // Event for updating audio level on slider value
    createSliderEvent() {
        this.volumebarId.addEventListener("input", this.updateVolumebar.bind(this));
    }

    // Event for toggling mute
    createMuteEvent() {
        this.volumeIconId.addEventListener("click", async () => {
            this.mute = !this.mute;
            this.updateVolumeIcon(this.volumeValue, this.mute);

            await window.window.api.volume.setMuted(this.mute);
        });
    }

    async updateVolumebar() {
        this.mute = false;
        this.volumeValue = this.volumebarId.value;

        this.updateVolumeText(this.volumeValue);
        this.updateVolumeIcon(this.volumeValue);

        await window.window.api.volume.setVolume(this.volumeValue);
        await window.window.api.volume.setMuted(this.mute);
    }

    // Update the text that represents the volume level
    updateVolumeText(value) {
        this.volumeId.innerText = value;
    }

    // Set volume icon by icon name
    setVolumeIcon(iconName) {
        this.volumeIconId.innerText = iconName;
    }

    // Update everything related to volume
    async updateAllVolume() {
        this.volumeValue = await window.window.api.volume.getVolume();
        this.mute = await window.window.api.volume.getMuted();

        this.updateVolumeText(this.volumeValue);
        this.volumebarId.value = this.volumeValue;
        this.updateVolumeIcon(this.volumeValue, this.mute)

        setTimeout(this.updateAllVolume.bind(this), 2000);
    }

    // Update icon based on it's value
    updateVolumeIcon(value, mute) {
        switch (!mute) {
            case (value <= 0):
                this.setVolumeIcon('volume_off');
                break;
            case (value < 25):
                this.setVolumeIcon('volume_mute');
                break;
            case (value < 70):
                this.setVolumeIcon('volume_down');
                break;
            case (value <= 100):
                this.setVolumeIcon('volume_up');
                break;
            default:
                this.setVolumeIcon('volume_off');
                break;
        }
    }
}

window.customElements.define('system-volume-widget', SystemVolume);
