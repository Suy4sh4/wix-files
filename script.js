// Initialize map
var map = L.map('map').setView([19.0760, 72.8777], 6); // Default view: Maharashtra

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to create a custom temple icon
function createTempleIcon() {
    return L.divIcon({
        className: 'leaflet-div-icon',
        html: '<img src="https://uxwing.com/wp-content/themes/uxwing/download/festival-culture-religion/temple-icon.png" style="width: 30px; height: 30px;"/>',
        iconSize: [30, 30],
    });
}

// Coordinates for cities in Maharashtra
var cityCoordinates = {
    mumbai: [19.0760, 72.8777],
    pune: [18.5204, 73.8567],
    nagpur: [21.1466, 79.0849],
    aurangabad: [19.8762, 75.3433],
    jalna: [19.8410, 75.8800],
    dhule: [20.9021, 74.7780]
};

// Coordinates for temples in cities
var cityTemples = {
    mumbai: [
        {coords: [19.0658, 72.9089], name: "Temple A", link: "https://www.google.com/maps/place/Chhatrapati+Sambhaji+Nagar,+Maharashtra/@19.8760675,75.3403626,101a,35y,85.55h,77.23t/data=!3m1!1e3!4m6!3m5!1s0x3bdb9815a369bc63:0x712d538b29a2a73e!8m2!3d19.875754!4d75.3393195!16zL20vMDJucGs1?entry=ttu&g_ep=EgoyMDI1MDEwNy4wIKXMDSoASAFQAw%3D%3D"},
        {coords: [19.0720, 72.8710], name: "Temple B", link: "https://www.google.com/maps/place/Chhatrapati+Shivaji+Maharaj+Museum,+Mumbai/@19.0925,72.8827,101a,35y,85.55h,77.23t/data=!3m1!1e3!4m6!3m5!1s0x3bdba5a2a2a32!8m2!3d19.0934!4d72.8815!16zL20vMDJucGs2"}
    ],
    pune: [
        {coords: [18.5204, 73.8567], name: "Temple C", link: "https://www.google.com/maps/place/Dagdusheth+Temple,+Pune/@18.5195,73.8555,101a,35y,85.55h,77.23t/data=!3m1!1e3!4m6!3m5!1s0x3bdba1ad0df2!8m2!3d18.5206!4d73.8553!16zL20vMDJucGs3"},
        {coords: [18.5333, 73.8765], name: "Temple D", link: "https://www.google.com/maps/place/Pataleshwar+Cave+Temple,+Pune/@18.5334,73.8765,101a,35y,85.55h,77.23t/data=!3m1!1e3!4m6!3m5!1s0x3bdba1ad4d8e!8m2!3d18.5312!4d73.8789!16zL20vMDJucGs4"}
    ],
    aurangabad: [
        {coords: [19.8760675, 75.3403626], name: "Temple E", link: "https://www.google.com/maps/place/Chhatrapati+Sambhaji+Nagar,+Maharashtra/@19.8760675,75.3403626,101a,35y,85.55h,77.23t/data=!3m1!1e3!4m6!3m5!1s0x3bdb9815a369bc63:0x712d538b29a2a73e!8m2!3d19.875754!4d75.3393195!16zL20vMDJucGs1"},
        {coords: [19.8323899, 75.2849197], name: "Temple F", link: "https://www.google.com/maps/place/Bibi+Ka+Maqbara,+Aurangabad/@19.8302,75.2876,101a,35y,85.55h,77.23t/data=!3m1!1e3!4m6!3m5!1s0x3bdbaadada0d!8m2!3d19.8351!4d75.2875!16zL20vMDJucGs9"}
    ],
    nagpur: [
        {coords: [21.1461018, 79.0790226], name: "Temple G", link: "https://www.google.com/maps/place/Deekshabhoomi,+Nagpur/@21.1463,79.0772,101a,35y,85.55h,77.23t/data=!3m1!1e3!4m6!3m5!1s0x3bdba04abf5e!8m2!3d21.1466!4d79.0792!16zL20vMDJucGs5"}
    ],
    jalna: [
        {coords: [19.8410, 75.8800], name: "Temple H", link: "https://www.google.com/maps/place/Jalna,+Maharashtra/@19.8410,75.8800,101a,35y,85.55h,77.23t/data=!3m1!1e3!4m6!3m5!1s0x3bdba0adad0c!8m2!3d19.8411!4d75.8801!16zL20vMDJucGs8"}
    ],
    dhule: [
        {coords: [20.8866422, 74.7671309], name: "Temple I", link: "https://www.google.com/maps/place/Dhule,+Maharashtra/@20.8866,74.7671,101a,35y,85.55h,77.23t/data=!3m1!1e3!4m6!3m5!1s0x3bdba09abcd3!8m2!3d20.8867!4d74.7672!16zL20vMDJucGs3"}
    ]
};

// City markers storage
var cityMarkers = {};

// Function to create city blips with zoom functionality
function createCityBlip(city, coordinates) {
    var cityBlip = L.marker(coordinates, { icon: createTempleIcon() })
        .addTo(map)
        .bindPopup(`${city.charAt(0).toUpperCase() + city.slice(1)} City`);

    cityBlip.on('click', function () {
        map.flyTo(coordinates, 12, { duration: 1 }); // Zoom to city
        addCityTemples(city); // Add temples inside the city
    });
}

// Add all city blips
Object.keys(cityCoordinates).forEach(function (city) {
    createCityBlip(city, cityCoordinates[city]);
});

// Function to remove markers from a city
function clearMarkers(city) {
    if (cityMarkers[city]) {
        cityMarkers[city].forEach(function (marker) {
            map.removeLayer(marker);
        });
        cityMarkers[city] = [];
    }
}

// Function to display weather information for a selected temple
function displayWeather(templeCoords) {
    const weatherBox = document.querySelector('.weather-info-box');
    if (weatherBox) weatherBox.remove(); // Clear old weather box

    getWeatherData(templeCoords[0], templeCoords[1])
        .then(weather => {
            const newWeatherBox = document.createElement('div');
            newWeatherBox.classList.add('weather-info-box');
            newWeatherBox.innerHTML = `
                <p>Temperature: ${weather.temperature}°C</p>
                <p>Weather: ${getWeatherEmoji(weather.weatherCode)}</p>
            `;
            document.getElementById('map').appendChild(newWeatherBox);
        })
        .catch(error => {
            console.error('Failed to fetch weather data:', error);
        });
}

// Fetch weather data from Open-Meteo API
function getWeatherData(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=Asia/Kolkata`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            return response.json();
        })
        .then(data => ({
            temperature: data.current_weather.temperature,
            weatherCode: data.current_weather.weathercode
        }))
        .catch(error => {
            console.error('Weather fetch error:', error);
            return { temperature: 'N/A', weatherCode: 0 }; // Fallback weather
        });
}


// Helper function to map weather codes to emojis
function getWeatherEmoji(code) {
    const weatherEmojis = {
        0: "☀️ Clear",
        1: "🌤️ Partly Cloudy",
        2: "☁️ Cloudy",
        3: "☁️ Overcast",
        61: "🌦️ Showers",
        80: "⛈️ Thunderstorm"
    };
    return weatherEmojis[code] || "☀️ Clear";
}

// Function to show and update the "Start Navigation" button when a temple is clicked
function showNavigationButton(temple) {
    let navigationButton = document.querySelector('.start-navigation');
    if (!navigationButton) {
        navigationButton = document.createElement('button');
        navigationButton.innerText = 'Start Navigation';
        navigationButton.className = 'start-navigation';
        document.querySelector('.container').appendChild(navigationButton);
    }

    navigationButton.style.display = 'block'; // Ensure the button is shown
    navigationButton.onclick = function () {
        window.open(temple.link, '_blank');
    };

    // Scroll to the button
    navigationButton.scrollIntoView({ behavior: "smooth" });
}

// Function to add temples inside a specific city
function addCityTemples(city) {
    clearMarkers(city); // Clear existing markers

    cityMarkers[city] = cityTemples[city].map(temple => {
        const templeMarker = L.marker(temple.coords, { icon: createTempleIcon() })
            .addTo(map)
            .bindPopup(`<b>${temple.name}</b>`); // Popup with temple name

        templeMarker.on('click', function () {
            showNavigationButton(temple); // Show navigation button
            displayWeather(temple.coords); // Display weather
        });

        return templeMarker;
    });
}

// Event listener for zoom changes
map.on('zoomend', function () {
    if (map.getZoom() < 12) {
        Object.keys(cityMarkers).forEach(clearMarkers); // Clear all temple markers
    }
});
