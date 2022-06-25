const template = document.createElement('template');
template.innerHTML = `
    <div class="light-container performance-container">
        <div class="widget-header flex-row space-between">
            <div class="flex-row flex-start">
                <h3>Performance</h3>
            </div>
        </div>
        <div id="performanceStats" class="performance-stats">
            <div id="cpuTab" class="performance-tab">
                <div class="flex-row space-between">
                    <p class="title">CPU</p>
                    <p class="usage"></p>
                </div>
                <div class="performance-bar"></div>
            </div>
            <div id="memoryTab" class="performance-tab">
                <div class="flex-row space-between">
                    <p class="title">RAM</p>
                    <p class="usage"></p>
                </div>
                <div class="performance-bar"></div>
            </div>
        </div>
    </div>
`;

/**
 * Performance widget to keep track of system information
 */
class Performance extends HTMLElement {
    constructor() {
        super();

        this.appendChild(template.content.cloneNode(true));

        // Default values
        const defaults = {
            delay: 2000,
            maxDrives: 4
        };

        this.performanceContainer = this.children[0];

        this.performanceStats = this.performanceContainer.querySelector("#performanceStats");
        this.cpuId = "cpuTab";
        this.memoryId = "memoryTab";
        this.delay = this.getAttribute("interval") ?? defaults.delay;
        this.setMaxDrives = this.getAttribute("max-drives");

        this.clearPerformanceStats().then(() => {
            this.updateStatistics();
            setInterval(this.updateStatistics.bind(this), this.delay);

            // Exception update every minute for cpu usage reasons
            this.updateDiskSpace();
            setInterval(this.updateDiskSpace.bind(this), 60000);
        });
    }

    set setMaxDrives(value) {
        if (value && (value <= 4 && value >= 0)) {
            this.maxDrives = value;
        }
        else {
            this.maxDrives = 4;
        }
    }

    // Update all performance stats information
    updateStatistics() {
        this.updateCpu();
        this.updateMemory();

        // Disabled because of performance issues
        // this.updateGpu();
    }

    // Initialize all stats before updating it
    async clearPerformanceStats() {
            this.updatePerformanceStat(this.cpuId, "CPU");
            this.updatePerformanceStat(this.memoryId, "RAM", 0, "0 / 0 GB (0%)");

            const load = await window.api.systemInformation.diskSpace();
            load.slice(0, this.maxDrives).forEach(disk => {
                this.addDiskSpaceTab(Performance.getDiskId(disk.fs));
                this.updatePerformanceStat(Performance.getDiskId(disk.fs), disk.fs, 0, "0 / 0 GB available");
            });
    }

    async updateCpu() {
        const load = await window.api.systemInformation.cpuLoad();
        this.updatePerformanceStat(this.cpuId, "CPU", load);
    }

    async updateMemory() {
        const load = await window.api.systemInformation.memoryLoad();
        this.updatePerformanceStat(this.memoryId, "RAM", load.usage, `${Performance.byteUnitToGb(load.used, 1, "KB")} / ${Performance.byteUnitToGb(load.total, 1, "KB")} GB (${load.usage}%)`);
    }

    async updateDiskSpace() {
        const load = await window.api.systemInformation.diskSpace();
        load.slice(0, this.maxDrives).forEach(disk => {
            this.updatePerformanceStat(Performance.getDiskId(disk.fs), disk.fs, disk.use, `${Performance.byteUnitToGb(disk.available, 2, "B")} / ${Performance.byteUnitToGb(disk.size, 0, "B")} GB available`);
        });
    }

    async updateGpu() {
        const load = await window.api.systemInformation.gpuLoad();
        this.updatePerformanceStat("gpuTab", "GPU", load[0].usage);
    }

    // General function for updating performance stat.
    // Id is passed to identify the stat div. Name, load and info can be changed for each of those stats.
    updatePerformanceStat(id, name, load = 0, info = load + "%") {
        this.getNameElemById(id).innerText = name;
        this.getInfoElemById(id).innerText = info;
        this.getBarElemById(id).style.width = `${load}%`;
    }

    // Return name element of the given performance stat Id
    getNameElemById(id) {
        return this.performanceContainer.querySelector("#" + id).children[0].children[0];
    }

    // Return info element of the given performance stat Id
    getInfoElemById(id) {
        return this.performanceContainer.querySelector("#" + id).children[0].children[1];
    }

    // Return progress bar element of the given performance stat Id
    getBarElemById(id) {
        return this.performanceContainer.querySelector("#" + id).children[1];
    }

    // Convert byte value to GB. Value will be round to the given decimals.
    static byteUnitToGb(size, decimals, unit = "B") {
        const units = {
            B: 3,
            KB: 2,
            MB: 1
        };
        return (decimals) ? (size / Math.pow(1024, units[unit])).toFixed(decimals) : Math.floor(size / Math.pow(1024, units[unit]));
    }

    // Add new element for the disk stat. Id will the set to the given Id.
    addDiskSpaceTab(id) {
        this.performanceStats.innerHTML += `
            <div id="${id}" class="performance-tab">
                <div class="flex-row space-between">
                    <p class="title">Disk</p>
                    <p class="usage"></p>
                </div>
                <div class="performance-bar"></div>
            </div>
        `;
    }

    static getDiskId(diskName) {
        return diskName.replace(":", "");
    }
}

window.customElements.define('performance-widget', Performance);
