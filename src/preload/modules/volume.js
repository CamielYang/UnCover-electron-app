const loudness = require('loudness')

const contextBridge = {
    getVolume: () => loudness.getVolume(),
    setVolume: (value) => loudness.setVolume(value),
    getMuted: () => loudness.getMuted(),
    setMuted: (bool) => loudness.setMuted(bool),
}

module.exports = {
    volume: contextBridge
};
