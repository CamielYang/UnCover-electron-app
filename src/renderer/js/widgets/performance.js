/**
 * Performance widget to keep track of system information
 *
 * @param {string} cpuId Id of time text.
 * @param {string} memoryId Id of set button.
 */
 export class Performance {
    constructor(performanceStats = "performanceStats", cpuId = "cpuTab", memoryId = "memoryTab", delay = 2000) {
        this.performanceStats = document.getElementById(performanceStats);
        this.cpuId = cpuId;
        this.memoryId = memoryId;
        this.delay = delay;
        this.maxDrives = 4;
        
        this.clearPerformanceStats();
        this.updateStatistics();
        setInterval(this.updateStatistics.bind(this), this.delay)
    }

    updateStatistics() {
        this.updateCpu();
        this.updateMemory();
        this.updateDiskSpace();
        
        // Disabled because of performance issues
        //this.updateGpu();
    }

    async clearPerformanceStats() {
            Performance.updatePerformanceStat(this.cpuId, "CPU");
            Performance.updatePerformanceStat(this.memoryId, "RAM", 0, "0 / 0 GB (0%)");

            const load = await api.diskSpace();
            load.slice(0, this.maxDrives).forEach(disk => {
                this.addDiskSpaceTab(disk.fs)
                Performance.updatePerformanceStat(disk.fs, disk.fs, 0, "0 / 0 GB available");
            });
    }

    async updateCpu() {
        const load = await api.cpuLoad();
        Performance.updatePerformanceStat(this.cpuId, "CPU", load)
    }

    async updateMemory() {
        const load = await api.memoryLoad();
        Performance.updatePerformanceStat(this.memoryId, "RAM", load.usage, `${Performance.byteToGb(load.used, 1)} / ${Performance.byteToGb(load.total, 1)} GB (${load.usage}%)`);
    }

    async updateDiskSpace() {
        const load = await api.diskSpace();
        load.slice(0, this.maxDrives).forEach(disk => {
            Performance.updatePerformanceStat(disk.fs, disk.fs, disk.use, `${Performance.byteToGb(disk.available, 2)} / ${Performance.byteToGb(disk.size, 0)} GB available`);
        });
    }

    async updateGpu() {
        const load = await api.gpuLoad()
        Performance.updatePerformanceStat("gpuTab", "GPU", load[0].usage)
    }
    
    static updatePerformanceStat(id, name, load = 0, info = load + "%") {
        Performance.getNameElemById(id).innerText = name;
        Performance.getPercentageElemById(id).innerText = info;
        Performance.getBarElemById(id).style.width = `${load}%`;
    }

    static getNameElemById(id) {
        return document.getElementById(id).children[0].children[0];
    }

    static getPercentageElemById(id) {
        return document.getElementById(id).children[0].children[1];
    }
    
    static getBarElemById(id) {
        return document.getElementById(id).children[1];
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
}