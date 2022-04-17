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
export class Performance extends HTMLElement {
    constructor() {
        super()

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

        this.clearPerformanceStats().then(e => {
            this.updateStatistics();
            setInterval(this.updateStatistics.bind(this), this.delay)
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

    updateStatistics() {
        this.updateCpu();
        this.updateMemory();
        this.updateDiskSpace();
        
        // Disabled because of performance issues
        //this.updateGpu();
    }

    async clearPerformanceStats() {
            this.updatePerformanceStat(this.cpuId, "CPU");
            this.updatePerformanceStat(this.memoryId, "RAM", 0, "0 / 0 GB (0%)");

            const load = await api.diskSpace();
            load.slice(0, this.maxDrives).forEach(disk => {
                this.addDiskSpaceTab(Performance.getDiskId(disk.fs))
                this.updatePerformanceStat(Performance.getDiskId(disk.fs), disk.fs, 0, "0 / 0 GB available");
            });
    }

    async updateCpu() {
        const load = await api.cpuLoad();
        this.updatePerformanceStat(this.cpuId, "CPU", load)
    }

    async updateMemory() {
        const load = await api.memoryLoad();
        this.updatePerformanceStat(this.memoryId, "RAM", load.usage, `${Performance.byteToGb(load.used, 1)} / ${Performance.byteToGb(load.total, 1)} GB (${load.usage}%)`);
    }

    async updateDiskSpace() {
        const load = await api.diskSpace();
        load.slice(0, this.maxDrives).forEach(disk => {
            this.updatePerformanceStat(Performance.getDiskId(disk.fs), disk.fs, disk.use, `${Performance.byteToGb(disk.available, 2)} / ${Performance.byteToGb(disk.size, 0)} GB available`);
        });
    }

    async updateGpu() {
        const load = await api.gpuLoad()
        this.updatePerformanceStat("gpuTab", "GPU", load[0].usage)
    }
    
    updatePerformanceStat(id, name, load = 0, info = load + "%") {
        this.getNameElemById(id).innerText = name;
        this.getPercentageElemById(id).innerText = info;
        this.getBarElemById(id).style.width = `${load}%`;
    }

    getNameElemById(id) {
        return this.performanceContainer.querySelector("#" + id).children[0].children[0];
    }

    getPercentageElemById(id) {
        return this.performanceContainer.querySelector("#" + id).children[0].children[1];
    }
    
    getBarElemById(id) {
        return this.performanceContainer.querySelector("#" + id).children[1];
    }

    static byteToGb(size, decimals) {
        return (decimals == 0) ? Math.floor(size / Math.pow(1024, 3)) : (size / Math.pow(1024, 3)).toFixed(decimals);
    }

    addDiskSpaceTab(id) {
        this.performanceStats.innerHTML += `
            <div id="${id}" class="performance-tab">
                <div class="flex-row space-between">
                    <p class="title">Disk</p>
                    <p class="usage"></p>
                </div>
                <div class="performance-bar"></div>
            </div>
        `
    }

    static getDiskId(diskName) {
        return diskName.replace(":", "");
    }
}

window.customElements.define('performance-widget', Performance);