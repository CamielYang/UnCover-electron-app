const template = document.createElement('template');
template.innerHTML = `
    <div class="light-container weather-container">
        <div id="currentWeather" class="current-weather">
            <div>
                <span class="weather-icon-main bi bi-cloud-sun-fill"></span>
            </div>
            <div class="weather-main">
                <h2>0°</h2>
                <h3>-</h3>
            </div>
        </div>
        <div id="weatherForecast" class="weather-sub">
            <div class="weather-sub-item">
                <h4>-</h4>
                <span class="weather-icon-sub bi bi-cloud-sun-fill"></span>
                <h4>0°</h4>
            </div>
        </div>
        <div class="weather-edit-location">
            <span class="material-icons">edit</span>
            <input id="editWeather" type="text"/>
        </div>
    </div>
`;

/**
 * Weather widget to show current weather and weather forecast.
 */
class Weather extends HTMLElement {
    static weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    constructor() {
        super();

        this.appendChild(template.content.cloneNode(true));

        // Default values
        const defaults = {
            location: "Hoogeveen",
            forecastDays: 3,
            delay: 3600000
        };

        this.weatherContainer = this.children[0];
        this.currentWeatherId = this.weatherContainer.querySelector("#currentWeather");
        this.weatherForecastId = this.weatherContainer.querySelector("#weatherForecast");
        this.editWeatherId = this.weatherContainer.querySelector("#editWeather");
        this.location = this.getAttribute("location") ?? defaults.location;
        this.setForecastDays = this.getAttribute("forecast-days") ?? defaults.forecastDays;
        this.delay = defaults.delay;

        this.editWeatherId.value = this.location;

        this.addEditEvent();
        this.updateWeather();
        this.updateInterval = setInterval(this.updateWeather.bind(this), this.delay);
    }

    set setForecastDays(value) {
        if (value && (value <= 5)) {
            this.forecastDays = value;
        }
        else {
            this.forecastDays = 5;
        }
    }

    addEditEvent() {
        this.editWeatherId.addEventListener("change", () => {
            let location = this.editWeatherId.value;
            location = location.charAt(0).toUpperCase() + location.slice(1);

            this.updateWeather(location);

            // Reset interval
            clearInterval(this.updateInterval);
            this.updateInterval = setInterval(this.updateWeather.bind(this), this.delay);
        });
    }

    #setLocation(location) {
        this.location = location;
    }

    // Convert Kelvin temperature to Celcius
    static kelvinToCelcius(kelvin) {
        return parseInt(kelvin - 273.15);
    }

    // Update weather content
    async updateWeather(location = undefined) {
        let weatherData;
        if (location) {
            this.#setLocation(location);
            weatherData = await window.api.weather.getWeatherData(location, true);
        }
        else {
            weatherData = await window.api.weather.getWeatherData(this.location, false);
        }

        this.updateCurrentWeather(weatherData.current);
        this.updateForecastWeather(weatherData.daily);
    }

    // Update the current weather data
    updateCurrentWeather(weatherData) {
        this.currentWeatherId.innerHTML = `
        <div id="currentWeatherIcon">
            <span class="weather-icon-main bi ${Weather.getWeatherIcon(weatherData.weather[0].icon)}"></span>
        </div>
        <div class="weather-main"">
            <h2 id="currentWeatherTemp">${Weather.kelvinToCelcius(weatherData.temp)}°</h2>
            <h3 id="currentWeatherCity">${this.location}</h3>
        </div>`;
    }

    // Update the weather forecast section
    updateForecastWeather(weatherData) {
        let forecastInfo = '';

        for(let day = 1; day <= this.forecastDays; day++) {
            const date = new Date(weatherData[day].dt * 1000);
            forecastInfo += `
            <div class="weather-sub-item">
                <h4>${Weather.weekday[date.getDay()]}</h4>
                <span class="weather-icon-sub bi ${Weather.getWeatherIcon(weatherData[day].weather[0].icon)}"></span>
                <h4>${Weather.kelvinToCelcius(weatherData[day].temp.day)}°</h4>
            </div>`;
        }

        this.weatherForecastId.innerHTML = forecastInfo;
    }

    // Get the icon for the corresponding weather
    // Check https://openweathermap.org/weather-conditions for icon code
    static getWeatherIcon(icon) {
        const iconCode = icon.substring(0, 2);
        switch (iconCode) {
            case '01':
                return 'bi-sun-fill';
            case '02':
                return 'bi-cloud-sun-fill';
            case '03':
                return 'bi-cloudy-fill';
            case '04':
                return 'bi-clouds-fill';
            case '09':
                return 'bi-cloud-rain-heavy-fill';
            case '10':
                return 'bi-cloud-drizzle-fill';
            case '11':
                return 'bi-cloud-lightning-fill';
            case '13':
                return 'bi-cloud-snow-fill';
            case '50':
                return 'bi-cloud-haze-fill';
            default:
                return 'bi-sun-fill';
        }
    }
}

window.customElements.define('weather-widget', Weather);
