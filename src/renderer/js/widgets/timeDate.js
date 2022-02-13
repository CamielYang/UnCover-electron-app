export class TimeDate {
    constructor(timeId = "time", dateId = "date") {
        this.timeId = document.getElementById(timeId);
        this.dateId = document.getElementById(dateId);

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