var map = L.map('map').setView([19.0760, 72.8777], 6); // Default view: Maharashtra

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// **Responsive Button Placement**:
// For touch devices, the map UI will make sure buttons don't overlap or interfere with map navigation.
document.querySelectorAll('.start-navigation, .plan-trip, .start-trip').forEach(button => {
    button.addEventListener('click', function () {
        // Adding functionality to adapt layout on click for small screens
        this.style.transform = 'scale(1)';
        this.style.transition = 'all 0.3s ease';
    });
});

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
        if (currentWeatherBox) {
            currentWeatherBox.remove(); // Remove previous weather box
        }
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

// Global variable to track the current weather box
let currentWeatherBox = null;

// Function to create and display weather info
function displayWeather(templeCoords) {
    // Remove the current weather box if it exists
    if (currentWeatherBox) {
        currentWeatherBox.remove();
    }

    // Fetch the weather data and display it
    getWeatherData(templeCoords[0], templeCoords[1])
        .then(weather => {
            // Create a new weather box for the selected temple
            currentWeatherBox = L.DomUtil.create('div', 'weather-info-box');
            currentWeatherBox.innerHTML = `
                <p>Temperature: ${weather.temperature}°C</p>
                <p>Weather: ${getWeatherEmoji(weather.weatherCode)}</p>
            `;

            // Add the weather box inside the map container
            document.getElementById('map').appendChild(currentWeatherBox);
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

// **Trip Planning Feature**

// Global variables for tracking temples and their trip list
let selectedTemples = []; // To track selected temples for trip
let currentTripMarkers = []; // To store the markers for selected temples
let tripInProgress = false; // Flag to track if a trip has started

// Function to create and show the "Start Navigation" button when a temple is clicked
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
    navigationButton.scrollIntoView({ behavior: "smooth" });
}

// Function to create the "Plan A Trip" or "Add Temple to Trip List" button after a temple is selected
function showPlanTripButton(temple) {
    let planButton = document.querySelector('.plan-trip');

    // If button doesn't exist, create it
    if (!planButton) {
        planButton = document.createElement('button');
        planButton.className = 'plan-trip';
        document.getElementById('map').appendChild(planButton); // Append to the map container
    }

    // Update button text based on trip progress
    if (tripInProgress) {
        planButton.innerText = 'Add Temple to Trip List';
    } else {
        planButton.innerText = 'Plan A Trip';
    }

    planButton.style.display = 'block'; // Show the button

    planButton.onclick = function () {
        if (!tripInProgress) {
            // Start a new trip
            tripInProgress = true;
            planButton.innerText = 'Add Temple to Trip List'; // Update button text
            addTempleToTrip(temple, planButton); // Add the selected temple to the trip
        } else {
            // Add more temples to the trip
            addTempleToTrip(temple, planButton);
        }
    };
}

// Function to add a temple to the trip list
function addTempleToTrip(temple, button) {
    // Check if temple is already added to the trip list
    if (selectedTemples.includes(temple)) {
        button.innerText = 'Temple Already Added';
        button.style.backgroundColor = 'red'; // Temporary feedback
        setTimeout(() => {
            button.innerText = 'Add Temple to Trip List'; // Reset button text
            button.style.backgroundColor = ''; // Reset color
        }, 2000);
    } else {
        // Add the temple to the trip list
        selectedTemples.push(temple);
        highlightTemple(temple);

        button.innerText = 'Temple added to List'; // Show success text
        button.style.backgroundColor = 'green'; // Provide feedback for successful addition
        setTimeout(() => {
            button.innerText = 'Add Temple to Trip List'; // Reset button text
            button.style.backgroundColor = ''; // Reset color
        }, 2000);
    }
}

// Function to highlight the temple on the map when added to the trip
function highlightTemple(temple) {
    const templeMarker = L.marker(temple.coords, { 
        icon: createHighlightedTempleIcon() 
    })
        .addTo(map)
        .bindPopup(`<b>${temple.name}</b>`); // Add popup to highlight the temple

    currentTripMarkers.push(templeMarker); // Store the temple marker for the trip
}

// Function to create highlighted temple icon
function createHighlightedTempleIcon() {
    return L.divIcon({
        className: 'leaflet-div-icon-highlighted',
        html: '<img src="https://uxwing.com/wp-content/themes/uxwing/download/festival-culture-religion/temple-icon.png" style="width: 50px; height: 50px; box-shadow: 0 0 10px 4px rgba(0, 121, 107, 0.7); border-radius: 50%;"/>',
        iconSize: [50, 50],
    });
}

// Function to clear all trip markers and reset the trip list
function resetTrip() {
    selectedTemples = [];
    tripInProgress = false; // Reset trip progress flag
    currentTripMarkers.forEach(marker => map.removeLayer(marker));
    currentTripMarkers = [];
    const planButton = document.querySelector('.plan-trip');
    const navigationButton = document.querySelector('.start-navigation');

    if (planButton) planButton.style.display = 'none';
    if (navigationButton) navigationButton.style.display = 'none';

    alert('Trip has been cancelled!');
}

function handleZoomOut() {
    // Check if zoom level is less than 12 (zoom out condition)
    if (map.getZoom() < 12) {
        // Remove all temple markers (this includes highlighted ones)
        currentTripMarkers.forEach(marker => map.removeLayer(marker));
        currentTripMarkers = []; // Reset the array of markers

        // Set to store cities that have selected temples
        const citiesWithSelectedTemples = new Set(selectedTemples.map(temple => temple.city));

        // Remove temple markers and only show city blips
        Object.keys(cityCoordinates).forEach(city => {
            if (citiesWithSelectedTemples.has(city)) {
                // Create a highlighted city blip for cities with selected temples
                const cityBlip = L.marker(cityCoordinates[city], {
                    icon: createHighlightedCityIcon(), // Create highlighted city icon
                })
                    .addTo(map)
                    .bindPopup(`<b>${city}</b>`);
                
                currentTripMarkers.push(cityBlip); // Add city blip to the current trip markers
            }
        });

        // Remove any weather box when zoomed out
        if (currentWeatherBox) {
            currentWeatherBox.remove();
        }
    }
}


// Function to create highlighted city icon
function createHighlightedCityIcon() {
    return L.divIcon({
        className: 'leaflet-div-icon-highlighted-city',
        html: '<div style="width: 40px; height: 40px; background-color: rgba(0, 121, 107, 0.9); border-radius: 50%; box-shadow: 0 0 15px 6px rgba(0, 121, 107, 0.7);"></div>',
        iconSize: [40, 40], // Slightly bigger size for better visibility
    });
}

// Event listener for zoom changes to handle weather box and markers
map.on('zoomend', function () {
    if (map.getZoom() < 12) {
        // Clear all temple markers when zoomed out
        Object.keys(cityMarkers).forEach(clearMarkers);
        if (currentWeatherBox) {
            currentWeatherBox.remove(); // Remove weather box if zoomed out
        }
    }
});

// Function to handle city temple selection and temple click
function addCityTemples(city) {
    clearMarkers(city); // Clear existing city markers

    cityMarkers[city] = cityTemples[city].map(temple => {
        const templeMarker = L.marker(temple.coords, { icon: createTempleIcon() })
            .addTo(map)
            .bindPopup(`<b>${temple.name}</b>`); // Add temple popup

        templeMarker.on('click', function () {
            showNavigationButton(temple); // Show "Start Navigation" button
            displayWeather(temple.coords); // Display temple weather info
            showPlanTripButton(temple); // Show "Plan Trip" button
        });

        return templeMarker;
    });
}

let userMarker;  // Store the single user marker
let watchId;     // Store the watch position ID

// Function to get and track the user’s live location
function getUserLocation() {
    const locationStatus = localStorage.getItem('locationPermissionStatus');

    if (navigator.geolocation) {
        if (locationStatus === 'approved') {
            // User previously approved, start tracking location
            watchId = navigator.geolocation.watchPosition(
                showUserLocation, 
                locationError,     
                { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
            );
        } else if (locationStatus === 'denied') {
            // User denied previously, ask again on every visit
            navigator.geolocation.getCurrentPosition(
                showUserLocation,
                locationError,
                { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
            );
        } else {
            // First visit, ask for location and save approval status
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    localStorage.setItem('locationPermissionStatus', 'approved');
                    showUserLocation(position);
                },
                locationError
            );
        }
    } else {
        alert("Geolocation is not supported by this browser.");
        initializeMapWithoutLocation();
    }
}

// Function to handle location errors
function locationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Location access denied.");
            localStorage.setItem('locationPermissionStatus', 'denied'); // Store denial
            initializeMapWithoutLocation();
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            initializeMapWithoutLocation();
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            initializeMapWithoutLocation();
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            initializeMapWithoutLocation();
            break;
    }
}

// Function to initialize map without user location (fallback)
function initializeMapWithoutLocation() {
    map.setView([19.0760, 72.8777], 6); // Default location (Mumbai, Maharashtra)
}

// Function to show and update user location on the map (with icon)
function showUserLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Set map view to the user's location
    map.setView([lat, lon], 12); // Zoom in to the user's location

    // Update the existing user marker position or create a new one if not already there
    if (userMarker) {
        userMarker.setLatLng([lat, lon]);  // Update marker position
    } else {
        // Create and add the user marker on first time
        userMarker = L.marker([lat, lon], {
            icon: L.divIcon({
                className: 'leaflet-div-icon',
                html: '<img src="https://cdn-icons-png.flaticon.com/512/9986/9986343.png" style="width: 30px; height: 30px;"/>', // Custom icon
                iconSize: [30, 30],
            })
        }).addTo(map).bindPopup("You are here!");
    }
}

// Stop watching the location when the user leaves the page or closes the tab
window.addEventListener('beforeunload', function() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);  // Stop tracking when leaving the page
    }
});

// Call this function on page load to manage the location access flow
getUserLocation();
