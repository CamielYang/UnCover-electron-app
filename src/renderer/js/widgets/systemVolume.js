/**
 * Volume widget to manage system volume. You can mute or change the system volume value.
 *
 * @param {string} volumebarId Id of volumebar.
 * @param {string} volumeIconId Id of volume icon.
 * @param {string} volumeId Id of volume value.
 */
export class SystemVolume {
    static volumeValue;
    static mute;

    constructor(volumebarId = "volumebar", volumeIconId = "volumeIcon", volumeId = "volume") {
        this.volumebarId = document.getElementById(volumebarId);
        this.volumeIconId = document.getElementById(volumeIconId);
        this.volumeId = document.getElementById(volumeId);

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
            
            await api.setMuted(this.mute);
        });
    }

    async updateVolumebar() {
        this.mute = false;
        this.volumeValue = this.volumebarId.value;
        
        this.updateVolumeText(this.volumeValue);
        this.updateVolumeIcon(this.volumeValue);

        await api.setVolume(this.volumeValue);
        await api.setMuted(this.mute);
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
        this.volumeValue = await api.getVolume();
        this.mute = await api.getMuted();

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