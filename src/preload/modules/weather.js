let cityCoords;
let weatherData;

// Fetch weather data
async function getWeatherData(city, updatedCity) {
    if (!cityCoords || updatedCity) {
        await getCoords(city);
    }

    let request = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${cityCoords[0].lat}&lon=${cityCoords[0].lon}&exclude=minutely,hourly,alerts&appid=${process.env.WEATHER_API_KEY}`);
    let response = await request.json();

    weatherData = response;

    return weatherData;
}

// Fetch coords of corresponding city
async function getCoords(city) {
    let request = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.WEATHER_API_KEY}`);
    let response = await request.json();

    cityCoords = response;

    return cityCoords;
}

const contextBridge = {
    getWeatherData: (city, updatedCity) => getWeatherData(city, updatedCity),
    getCoords: (city) => getCoords(city),
};

module.exports = {
    weather: contextBridge
};
