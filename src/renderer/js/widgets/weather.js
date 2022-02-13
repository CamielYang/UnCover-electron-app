/**
 * Weather widget to show current weather and weather forecast.
 *
 * @param {string} currentWeatherId Id of current weather Div.
 * @param {string} weatherForecastId Id of weather forecast Div.
 * @param {string} location Location of the weather data.
 * @param {number} forecastDays Amount of days to show forecast weather data.
 */
export class Weather {
    static weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

    constructor(currentWeatherId = "currentWeather", weatherForecastId = "weatherForecast", location = "Hoogeveen", forecastDays = 3) {
        this.currentWeatherId = document.getElementById(currentWeatherId);
        this.weatherForecastId = document.getElementById(weatherForecastId);
        this.location = location;
        this.forecastDays = forecastDays;

        this.updateWeather();
    }

    #setLocation(location) {
        this.location = location;
    }

    // Convert Kelvin temperature to Celcius
    static kelvinToCelcius(kelvin) {
        return parseInt(kelvin - 273.15)
    }

    // Update weather content
    async updateWeather(location) {
        let weatherData;
        if (location) {
            this.#setLocation(location);
            weatherData = await api.getWeatherData(location, true);
        }
        else {
            weatherData = await api.getWeatherData(this.location, false);
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
        </div>`
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
            </div>`
        }

        this.weatherForecastId.innerHTML = forecastInfo;
    }

    // Get the icon for the corresponding weather
    // Check https://openweathermap.org/weather-conditions for icon code
    static getWeatherIcon(icon) {
        const iconCode = icon.substring(0, 2);
        switch (iconCode) {
            case '01':
                return 'bi-sun-fill'
            case '02':
                return 'bi-cloud-sun-fill'
            case '03':
                return 'bi-cloudy-fill'
            case '04':
                return 'bi-clouds-fill'
            case '09':
                return 'bi-cloud-rain-heavy-fill'
            case '10':
                return 'bi-cloud-drizzle-fill'
            case '11':
                return 'bi-cloud-lightning-fill'
            case '13':
                return 'bi-cloud-snow-fill'
            case '50':
                return 'bi-cloud-haze-fill'
            default:
                return 'bi-sun-fill'
        }
    }
}