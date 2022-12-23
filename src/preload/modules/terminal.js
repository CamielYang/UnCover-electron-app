const terminal = require('child_process').spawn("cmd");

function sendCommand(command) {
    terminal.stdin.write(`${command}\n`);
}

terminal.stdout.on('data', function (data) {
    const terminalData = new CustomEvent('terminal-data', { detail: { stdout: data.toString() }});
    document.dispatchEvent(terminalData);
});

const contextBridge = {
    sendCommand: (command) => sendCommand(command),
};

export default contextBridge;
