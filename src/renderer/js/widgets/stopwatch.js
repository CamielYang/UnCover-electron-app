import { Dropdown } from "../helpers/dropdown.js";

const template = document.createElement('template');
template.innerHTML = `
    <div class="light-container clock-container">
        <div class="widget-header flex-row space-between">
            <div class="flex-row">
                <div id="stopWatchList" class="dropdown">
                </div>
            </div>
            <div class="flex-row flex-buttons">
                <button id="resetStopwatch" class="button button-primary">Reset</button>
                <button id="setStopwatch" class="button button-primary">Start</button>
            </div>
        </div>
        <h1 id="stopwatchTime">00:00:00</h1>
    </div>
`;

class Stopwatch extends HTMLElement {
    constructor() {
        super();

        this.appendChild(template.content.cloneNode(true));

        this.stopwatchContainer = this.children[0];

        this.startTime;
        this.stopwatchInterval;
        this.elapsed;
        this.stopwatchStarted = false;

        this.stopWatchResetButton = this.stopwatchContainer.querySelector("#resetStopwatch");
        this.stopWatchSetButton = this.stopwatchContainer.querySelector("#setStopwatch");
        this.stopwatchTime = this.stopwatchContainer.querySelector("#stopwatchTime");

        this.renderDropdown();
        this.resetStopwatch();
        this.createStopwatchEvents();
    }

    createStopwatchEvents() {
        // Add event on reset button
        this.stopWatchResetButton.addEventListener("click", () => {
            this.resetStopwatch();
        });

        // Add event on start and stop button
        this.stopWatchSetButton.addEventListener("click", () => {
            this.stopwatchStarted ? this.stopStopWatch() : this.startStopwatch();
        });
    }

    // Start stopwatch
    startStopwatch() {
        this.startTime = new Date() - this.elapsed;

        this.stopWatchSetButton.innerText = "Stop";
        this.stopwatchStarted = true;
        this.stopwatchInterval = setInterval(this.updateStopwatch.bind(this), 1000);
    }

    // Reset stopwatch values and text
    resetStopwatch() {
        this.startTime = undefined;
        this.elapsed = 0;
        this.stopwatchTime.innerHTML = "00:00:00";
    }

    // Pause stopwatch timer
    stopStopWatch() {
        this.elapsed = new Date() - this.startTime;
        this.stopWatchSetButton.innerText = "Start";
        this.stopwatchStarted = false;

        clearInterval(this.stopwatchInterval);
    }

    // Update elapsed stopwatch time
    updateStopwatch() {
        this.checkStartTime();

        const now = new Date();
        const distance = now - this.startTime;
        let h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let s = Math.floor((distance % (1000 * 60)) / 1000);

        h = Stopwatch.checkTime(h);
        m = Stopwatch.checkTime(m);
        s = Stopwatch.checkTime(s);

        this.stopwatchTime.innerHTML = h + ":" + m + ":" + s;
    }

    // Check if start time is set. Else set a new start time on the current time
    checkStartTime() {
        if (!this.startTime) {
            this.startTime = new Date();
        }
    }

    // Format time
    static checkTime(i) {
        // add zero in front of numbers < 10
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    renderDropdown() {
        const dropdown = this.stopwatchContainer.querySelector("#stopWatchList");

        const dropdownItems = [
            {
                "name": "Timer"
            },
            {
                "name": "Stopwatch"
            }
        ];

        Dropdown.createDropdownList(dropdown, dropdownItems, 1);
    }
}

window.customElements.define('stopwatch-widget', Stopwatch);
