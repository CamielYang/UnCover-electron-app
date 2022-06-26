const template = document.createElement('template');
template.innerHTML = `
    <div class="time-container">
        <div id="clockDigital" class="clock-digital">
            <h1 id="time">00:00:00</h1>
            <h2 id="date">Monday, January 1, 2000</h2>
        </div>

        <div id="clockAnalog" class="clock-analog">
            <div id="clockHour" class="hand hour"></div>
            <div id="clockMinute" class="hand minute"></div>
            <div id="clockSecond" class="hand second"></div>
            <span style="--i:1;"><b>1</b></span>
            <span style="--i:2;"><b>2</b></span>
            <span style="--i:3;"><b>3</b></span>
            <span style="--i:4;"><b>4</b></span>
            <span style="--i:5;"><b>5</b></span>
            <span style="--i:6;"><b>6</b></span>
            <span style="--i:7;"><b>7</b></span>
            <span style="--i:8;"><b>8</b></span>
            <span style="--i:9;"><b>9</b></span>
            <span style="--i:10;"><b>10</b></span>
            <span style="--i:11;"><b>11</b></span>
            <span style="--i:12;"><b>12</b></span>
        </div>
    </div>
`;

const clockMode = {
    Analog: 0,
    Digital: 1
};

/**
 * Time and date widget to show current time and todays date.
 */
class TimeDate extends HTMLElement {
    constructor() {
        super();

        this.appendChild(template.content.cloneNode(true));

        this.clockMode;
        this.timeContainer = this.children[0];

        this.timeContainer.addEventListener("click", () => {
            this.setMode(this.clockMode == clockMode.Analog ? clockMode.Digital : clockMode.Analog);
        });

        this.digitalDiv = this.timeContainer.querySelector("#clockDigital");
        this.analogDiv = this.timeContainer.querySelector("#clockAnalog");

        this.timeId = this.timeContainer.querySelector("#time");
        this.dateId = this.timeContainer.querySelector("#date");

        this.clockHour = this.timeContainer.querySelector("#clockHour");
        this.clockMinute = this.timeContainer.querySelector("#clockMinute");
        this.clockSecond = this.timeContainer.querySelector("#clockSecond");

        this.setMode(clockMode.Analog);
        this.startTime();
        this.getDate();
    }

     // Return right format
     static checkTime(i) {
        // add zero in front of numbers < 10
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    // Update time every second
    startTime() {
        this.updateTime();

        setTimeout(this.startTime.bind(this), 1000);
    }

    updateTime() {
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();

        if (this.clockMode == clockMode.Digital) {
            h = TimeDate.checkTime(h);
            m = TimeDate.checkTime(m);
            s = TimeDate.checkTime(s);

            this.timeId.innerHTML = h + ":" + m + ":" + s;
        }
        else {
            let secondsRatio = today.getSeconds() / 60;
            let minutesRatio = (secondsRatio + today.getMinutes()) / 60;
            let hoursRatio = (minutesRatio + today.getHours()) / 12;

            this.setRotation(this.clockSecond, secondsRatio);
            this.setRotation(this.clockMinute, minutesRatio);
            this.setRotation(this.clockHour, hoursRatio);
        }
    }

    // get current date
    getDate() {
        const today = new Date();
        const locale = 'en-US';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        this.dateId.innerText = today.toLocaleDateString(locale, options);
    }

    setRotation(element, rotationRatio) {
        element.style.setProperty('--rotation', rotationRatio * 360);
    }

    setMode(mode) {
        this.clockMode = mode;

        this.digitalDiv.style.display = this.analogDiv.style.display = "none";

        switch(mode) {
            case clockMode.Analog:
                this.analogDiv.style.display = "flex";
                break;
            case clockMode.Digital:
                this.digitalDiv.style.display = "flex";
                break;
            default:
                this.digitalDiv.style.display = "flex";
                break;
        }

        this.updateTime();
    }
}

window.customElements.define('time-date-widget', TimeDate);
