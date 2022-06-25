const si = require('systeminformation');

const contextBridge = {
    cpuLoad: () => si.currentLoad().then(data => Math.floor(data.currentLoad)),
    memoryLoad: () => {
        const data = process.getSystemMemoryInfo();

        return {
            total: data.total,
            used: data.total - data.free,
            usage: Math.floor((data.total - data.free) / data.total * 100)
        };
    },
    diskSpace: () => {
        return si.fsSize().then(data => {
            return data;
        });
    },
    gpuLoad: async () => {
        const graphics = await si.graphics();
        const controllers = []
        graphics.controllers.forEach(controller => {
            // Only push graphics controllers that are non dedicated (static VRAM)
            if (!controller.vramDynamic) {
                controllers.push( {
                    model: controller.model,
                    usage: Math.floor(controller.memoryUsed / controller.memoryTotal * 100)
                })
            }
        })
        return controllers;
    },
}

module.exports = {
    systemInformation: contextBridge
}
