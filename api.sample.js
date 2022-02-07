// Sample API Calls
let cityCoords = [
    {
        "name": "Hoogeveen",
        "local_names": {
            "nl": "Hoogeveen",
            "fy": "Hegefean"
        },
        "lat": 52.7264258,
        "lon": 6.49308148854467,
        "country": "NL",
        "state": "Drenthe"
    }
];

let weatherData = {
    "lat": 52.7264,
    "lon": 6.4931,
    "timezone": "Europe/Amsterdam",
    "timezone_offset": 3600,
    "current": {
        "dt": 1644248160,
        "sunrise": 1644217593,
        "sunset": 1644251389,
        "temp": 279.28,
        "feels_like": 275.64,
        "pressure": 1024,
        "humidity": 80,
        "dew_point": 276.09,
        "uvi": 0,
        "clouds": 15,
        "visibility": 10000,
        "wind_speed": 5.61,
        "wind_deg": 266,
        "wind_gust": 10.17,
        "weather": [
            {
                "id": 801,
                "main": "Clouds",
                "description": "few clouds",
                "icon": "02d"
            }
        ]
    },
    "daily": [
        {
            "dt": 1644231600,
            "sunrise": 1644217593,
            "sunset": 1644251389,
            "moonrise": 1644226680,
            "moonset": 1644189000,
            "moon_phase": 0.21,
            "temp": {
                "day": 280.09,
                "min": 276.27,
                "max": 280.23,
                "night": 277.63,
                "eve": 278.9,
                "morn": 278.09
            },
            "feels_like": {
                "day": 275.79,
                "night": 273.22,
                "eve": 275.22,
                "morn": 272.85
            },
            "pressure": 1021,
            "humidity": 73,
            "dew_point": 275.59,
            "wind_speed": 10.4,
            "wind_deg": 303,
            "wind_gust": 17.96,
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "clouds": 6,
            "pop": 0.8,
            "uvi": 0.96
        },
        {
            "dt": 1644318000,
            "sunrise": 1644303884,
            "sunset": 1644337905,
            "moonrise": 1644313980,
            "moonset": 1644279840,
            "moon_phase": 0.25,
            "temp": {
                "day": 282.15,
                "min": 278.14,
                "max": 282.23,
                "night": 281.95,
                "eve": 281.92,
                "morn": 280.65
            },
            "feels_like": {
                "day": 278.45,
                "night": 278.77,
                "eve": 278.81,
                "morn": 276.83
            },
            "pressure": 1024,
            "humidity": 78,
            "dew_point": 278.61,
            "wind_speed": 8.29,
            "wind_deg": 249,
            "wind_gust": 15.78,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04d"
                }
            ],
            "clouds": 82,
            "pop": 0,
            "uvi": 0.27
        },
        {
            "dt": 1644404400,
            "sunrise": 1644390174,
            "sunset": 1644424421,
            "moonrise": 1644401520,
            "moonset": 1644370620,
            "moon_phase": 0.28,
            "temp": {
                "day": 282.87,
                "min": 279.4,
                "max": 282.87,
                "night": 280.21,
                "eve": 281.28,
                "morn": 280.84
            },
            "feels_like": {
                "day": 279.74,
                "night": 279,
                "eve": 278.34,
                "morn": 277.24
            },
            "pressure": 1023,
            "humidity": 72,
            "dew_point": 278.23,
            "wind_speed": 7.14,
            "wind_deg": 234,
            "wind_gust": 14.12,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 95,
            "pop": 0.2,
            "rain": 0.13,
            "uvi": 0.24
        },
        {
            "dt": 1644490800,
            "sunrise": 1644476462,
            "sunset": 1644510937,
            "moonrise": 1644489300,
            "moonset": 1644461340,
            "moon_phase": 0.31,
            "temp": {
                "day": 276.63,
                "min": 275.71,
                "max": 280.85,
                "night": 275.71,
                "eve": 277.15,
                "morn": 279.64
            },
            "feels_like": {
                "day": 272.48,
                "night": 271.44,
                "eve": 273.04,
                "morn": 277.23
            },
            "pressure": 1017,
            "humidity": 96,
            "dew_point": 276.02,
            "wind_speed": 5.87,
            "wind_deg": 228,
            "wind_gust": 12.01,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 100,
            "pop": 1,
            "rain": 2.78,
            "uvi": 0.54
        },
        {
            "dt": 1644577200,
            "sunrise": 1644562748,
            "sunset": 1644597453,
            "moonrise": 1644577620,
            "moonset": 1644551820,
            "moon_phase": 0.34,
            "temp": {
                "day": 277.99,
                "min": 273.33,
                "max": 277.99,
                "night": 273.33,
                "eve": 274.27,
                "morn": 275.28
            },
            "feels_like": {
                "day": 274.17,
                "night": 270.08,
                "eve": 271.27,
                "morn": 269.77
            },
            "pressure": 1030,
            "humidity": 56,
            "dew_point": 269.91,
            "wind_speed": 7.52,
            "wind_deg": 283,
            "wind_gust": 13.9,
            "weather": [
                {
                    "id": 616,
                    "main": "Snow",
                    "description": "rain and snow",
                    "icon": "13d"
                }
            ],
            "clouds": 55,
            "pop": 0.95,
            "rain": 0.17,
            "snow": 1.92,
            "uvi": 0.86
        },
        {
            "dt": 1644663600,
            "sunrise": 1644649033,
            "sunset": 1644683969,
            "moonrise": 1644666540,
            "moonset": 1644641880,
            "moon_phase": 0.37,
            "temp": {
                "day": 277.65,
                "min": 272.89,
                "max": 277.65,
                "night": 273.61,
                "eve": 274.84,
                "morn": 272.89
            },
            "feels_like": {
                "day": 273.49,
                "night": 269.26,
                "eve": 270.94,
                "morn": 269.48
            },
            "pressure": 1036,
            "humidity": 58,
            "dew_point": 270.19,
            "wind_speed": 5.81,
            "wind_deg": 207,
            "wind_gust": 10.3,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04d"
                }
            ],
            "clouds": 54,
            "pop": 0,
            "uvi": 1
        },
        {
            "dt": 1644750000,
            "sunrise": 1644735317,
            "sunset": 1644770485,
            "moonrise": 1644756240,
            "moonset": 1644731340,
            "moon_phase": 0.4,
            "temp": {
                "day": 278.46,
                "min": 272.72,
                "max": 278.46,
                "night": 276.59,
                "eve": 276.64,
                "morn": 272.72
            },
            "feels_like": {
                "day": 274,
                "night": 271.08,
                "eve": 271.65,
                "morn": 267.78
            },
            "pressure": 1026,
            "humidity": 42,
            "dew_point": 266.69,
            "wind_speed": 8.65,
            "wind_deg": 195,
            "wind_gust": 18.59,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04d"
                }
            ],
            "clouds": 82,
            "pop": 0,
            "uvi": 1
        },
        {
            "dt": 1644836400,
            "sunrise": 1644821599,
            "sunset": 1644857000,
            "moonrise": 1644846600,
            "moonset": 1644820140,
            "moon_phase": 0.43,
            "temp": {
                "day": 281.89,
                "min": 276.15,
                "max": 281.89,
                "night": 277.07,
                "eve": 278.02,
                "morn": 276.63
            },
            "feels_like": {
                "day": 278.05,
                "night": 273.5,
                "eve": 274.21,
                "morn": 271.47
            },
            "pressure": 1016,
            "humidity": 77,
            "dew_point": 278.06,
            "wind_speed": 8.58,
            "wind_deg": 200,
            "wind_gust": 17.67,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 71,
            "pop": 1,
            "rain": 1.71,
            "uvi": 1
        }
    ]
};