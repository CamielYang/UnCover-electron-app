const bin = 'cmd';
const options = {
    cwd: '/Users'
};

const startSeparate = [
    "python",
    "npm",
    "yarn",
];

const {
    ipcRenderer
} = require('electron');
const spawn = require('child_process').spawn;
let terminal = spawn(bin, options);
const escapeHtml = require('../../renderer/js/helpers/escapeHtml').escapeHtml;

function startTerminal() {
    terminal = spawn(bin, options);

    terminal.stderr.on('data', function (data) {
        const terminalData = new CustomEvent('terminal-data', { detail: { stdout: escapeHtml(data.toString()) }});
        document.dispatchEvent(terminalData);
    });

    terminal.stdout.on('data', function (data) {
        const terminalData = new CustomEvent('terminal-data', { detail: { stdout: escapeHtml(data.toString()) }});
        document.dispatchEvent(terminalData);
    });
}

function restartTerminal() {
    terminal.kill();
    startTerminal();
}

function sendCommand(command) {
    let createCommand = `${command}\n`;

    if (startSeparate.includes(command.split(' ')[0])) {
        createCommand = "start cmd /k " + createCommand;
        ipcRenderer.invoke('close-window', '');
    }
    terminal.stdin.write(createCommand);
}

window.addEventListener('DOMContentLoaded', () => {
    startTerminal();
});

const contextBridge = {
    restartTerminal: () => restartTerminal(),
    sendCommand: (command) => sendCommand(command),
};

export default contextBridge;
