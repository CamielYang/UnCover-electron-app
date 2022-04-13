const template = document.createElement('template');
template.innerHTML = `
    <div class="time-container">
        <h1 id="time">00:00:00</h1>
        <h2 id="date">Monday, January 1, 2000</h2>
    </div>
`;

/**
 * Time and date widget to show current time and todays date.
 */
export class TimeDate extends HTMLElement {
    constructor() {
        super()

        this.appendChild(template.content.cloneNode(true));

        this.timeContainer = this.children[0];
        this.timeId = this.timeContainer.querySelector("#time");
        this.dateId = this.timeContainer.querySelector("#date");

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
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();

        h = TimeDate.checkTime(h);
        m = TimeDate.checkTime(m);
        s = TimeDate.checkTime(s);

        this.timeId.innerHTML = h + ":" + m + ":" + s;

        setTimeout(this.startTime.bind(this), 1000);
    }

    // get current date
    getDate() {
        const today = new Date();
        const locale = 'en-US';
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        this.dateId.innerText = today.toLocaleDateString(locale, options);
    }
}

window.customElements.define('time-date-widget', TimeDate);