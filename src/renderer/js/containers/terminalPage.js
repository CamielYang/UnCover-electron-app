import { PageHandler } from "../helpers/pageHandler.js";

const pageId = "terminalPage";

const template = document.createElement('template');
template.innerHTML = /*html*/`
     <div class="page" id="${pageId}">
        <div class="flex-row flex-start header">
            <button id="returnOverlayBtn" class="material-icons icon-button">arrow_back</button>
            <h2 class="return-head">Terminal</h2>
        </div>
        <div class="light-container page-container terminal-container">
            <div class="terminal-output" id="terminalOutput">
            </div>
            <input type="text" id="terminalInput" />
        </div>
    </div>
`;

class Terminal extends HTMLElement {
    constructor() {
        super();

        this.appendChild(template.content.cloneNode(true));

        this.terminalContainer = this.children[0];

        this.terminalInput = this.terminalContainer.querySelector("#terminalInput");
        this.terminalOutput = this.terminalContainer.querySelector("#terminalOutput");

        this.addEvents();
    }

    addEvents() {
        document.getElementById("terminalBtn").addEventListener("click", () => {
            PageHandler.switchPage(pageId);
        });

        this.terminalContainer.querySelector("#returnOverlayBtn").addEventListener("click", () => {
            PageHandler.switchToMainPage();
        });

        this.terminalInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                window.api.terminal.sendCommand(this.terminalInput.value);
                this.terminalInput.value = "";
            }
        });

        document.addEventListener("terminal-data", (e) => {
            if (e.detail.stdout == "clear\n") {
                this.terminalOutput.innerHTML = "";
                return;
            }
            this.terminalOutput.innerHTML += e.detail.stdout;
            this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
        });
    }
}

window.customElements.define('terminal-page', Terminal);
