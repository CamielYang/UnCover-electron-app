/**
 * Stopwatch widget to keep track of your time. 
 * Stopwatch determines elapsed time with the start and current time for accurate timing.
 *
 * @param {string} timeId Id of time text.
 * @param {string} setId Id of set button.
 * @param {string} resetId Id of reset button.
 */
 export class Stopwatch {
    constructor(timeId = "stopwatchTime", setId = "setStopwatch", resetId = "resetStopwatch") {
        this.startTime;
        this.stopwatchInterval;
        this.elapsed;
        
        this.stopwatchStarted = false; 
        this.stopWatchResetButton = document.getElementById(resetId);
        this.stopWatchSetButton = document.getElementById(setId);
        this.stopwatchTime = document.getElementById(timeId);

        this.resetStopwatch();
        this.createEvents();
    }

    createEvents() {
        // Add event on reset button
        this.stopWatchResetButton.addEventListener("click", () => {
            this.resetStopwatch();
        })
    
        // Add event on start and stop button
        this.stopWatchSetButton.addEventListener("click", () => {
            this.stopwatchStarted ? this.stopStopWatch() : this.startStopwatch();
        })
    }

    // Start stopwatch
    startStopwatch() {
        this.startTime = new Date() - this.elapsed;

        this.stopWatchSetButton.innerText = "Stop";
        this.stopwatchStarted = true;
        this.stopwatchInterval = setInterval(this.updateStopwatch.bind(this), 1000)    
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
        this.currentTime += 1000;
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
}