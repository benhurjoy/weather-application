// WeatherAPI.com configuration
const API_KEY = '293e9bf1b62a4cd5a9055120250708'; // Replace with your WeatherAPI key
const BASE_URL = 'https://api.weatherapi.com/v1';

// DOM elements
const cityInput = document.getElementById('city');
const locationName = document.getElementById('location-name');
const currentDate = document.getElementById('current-date');
const weatherIcon = document.getElementById('weather-icon');
const currentTemp = document.getElementById('current-temp');
const weatherDescription = document.getElementById('weather-description');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const feelsLike = document.getElementById('feels-like');
const forecastContainer = document.getElementById('forecast-container');
const loadingScreen = document.getElementById('loading-screen');
const bgVideo = document.getElementById('bg-video');

// Global variables
let currentWeatherData = null;
let currentForecastData = null;
let temperatureUnit = 'c'; // Default to Celsius
let videoLoaded = false;
let weatherDataLoaded = false;

// Initialize with default city
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    
    // Set timeout as fallback in case video takes too long to load
    setTimeout(hideLoadingScreen, 5000);
    
    // Start loading weather data
    getWeatherData('New York');
});

// Hide loading screen when video is ready
function hideLoadingScreen() {
    videoLoaded = true;
    bgVideo.classList.add('loaded');
    
    // Only hide loading screen if weather data is also loaded
    if (weatherDataLoaded) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Remove loading screen from DOM after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
    }
}

// Mark weather data as loaded
function markWeatherDataLoaded() {
    weatherDataLoaded = true;
    
    // Only hide loading screen if video is also loaded
    if (videoLoaded) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Remove loading screen from DOM after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
    }
}

// Update current date
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
}

// Toggle temperature unit
function toggleTemperatureUnit(unit) {
    temperatureUnit = unit;
    
    // Update display if we have data
    if (currentWeatherData && currentForecastData) {
        updateCurrentWeather(currentWeatherData);
        updateForecast(currentForecastData);
    }
}

// Get weather data from WeatherAPI
async function getWeatherData(city = null) {
    const cityName = city || cityInput.value || 'New York';
    
    if (!cityName.trim()) {
        showError('Please enter a city name');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Get current weather and forecast in one call
        const response = await axios.get(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(cityName)}&days=3&aqi=no&alerts=no`
        );
        
        // Store the data
        currentWeatherData = response.data;
        currentForecastData = response.data;
        
        updateCurrentWeather(response.data);
        updateForecast(response.data);
        
        // Mark weather data as loaded
        markWeatherDataLoaded();
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        if (error.response && error.response.status === 400) {
            showError('City not found. Please check the spelling and try again.');
        } else {
            showError('Failed to fetch weather data. Please try again later.');
        }
        
        // Still mark as loaded to hide loading screen
        markWeatherDataLoaded();
    } finally {
        setLoadingState(false);
    }
}

// Update current weather display
function updateCurrentWeather(data) {
    const location = data.location;
    const current = data.current;
    
    locationName.textContent = `${location.name}, ${location.country}`;
    
    // Update temperatures based on selected unit
    if (temperatureUnit === 'c') {
        currentTemp.textContent = `${Math.round(current.temp_c)}°C`;
        feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
        windSpeed.textContent = `${current.wind_kph} km/h`;
    } else {
        currentTemp.textContent = `${Math.round(current.temp_f)}°F`;
        feelsLike.textContent = `${Math.round(current.feelslike_f)}°F`;
        windSpeed.textContent = `${current.wind_mph} mph`;
    }
    
    weatherDescription.textContent = current.condition.text;
    humidity.textContent = `${current.humidity}%`;
    
    // Update weather icon
    updateWeatherIcon(current.condition.code, current.is_day);
}

// Update weather icon based on WeatherAPI condition codes
function updateWeatherIcon(conditionCode, isDay) {
    // WeatherAPI condition codes mapping to Font Awesome icons
    const iconMap = {
        // Sunny/Clear
        1000: isDay ? 'fa-sun' : 'fa-moon',
        
        // Cloudy
        1003: isDay ? 'fa-cloud-sun' : 'fa-cloud-moon',
        1006: 'fa-cloud',
        1009: 'fa-cloud',
        
        // Overcast
        1030: 'fa-smog',
        1135: 'fa-smog',
        1147: 'fa-smog',
        
        // Fog
        1150: 'fa-smog',
        1153: 'fa-smog',
        1168: 'fa-smog',
        1171: 'fa-smog',
        
        // Rain
        1063: 'fa-cloud-rain',
        1180: 'fa-cloud-rain',
        1183: 'fa-cloud-rain',
        1186: 'fa-cloud-rain',
        1189: 'fa-cloud-rain',
        1192: 'fa-cloud-rain',
        1195: 'fa-cloud-rain',
        1240: 'fa-cloud-rain',
        1243: 'fa-cloud-rain',
        1246: 'fa-cloud-rain',
        
        // Snow
        1066: 'fa-snowflake',
        1114: 'fa-snowflake',
        1117: 'fa-snowflake',
        1210: 'fa-snowflake',
        1213: 'fa-snowflake',
        1216: 'fa-snowflake',
        1219: 'fa-snowflake',
        1222: 'fa-snowflake',
        1225: 'fa-snowflake',
        1255: 'fa-snowflake',
        1258: 'fa-snowflake',
        
        // Thunderstorm
        1087: 'fa-bolt',
        1273: 'fa-bolt',
        1276: 'fa-bolt',
        1279: 'fa-bolt',
        1282: 'fa-bolt'
    };
    
    const iconClass = iconMap[conditionCode] || 'fa-cloud';
    weatherIcon.className = `fas ${iconClass}`;
    
    // Update icon color based on time of day and condition
    if (conditionCode === 1000) {
        weatherIcon.style.color = isDay ? '#f39c12' : '#f1c40f';
    } else if ([1003, 1006, 1009].includes(conditionCode)) {
        weatherIcon.style.color = '#7f8c8d';
    } else if ([1063, 1180, 1183, 1186, 1189, 1192, 1195].includes(conditionCode)) {
        weatherIcon.style.color = '#3498db';
    } else {
        weatherIcon.style.color = '#95a5a6';
    }
}

// Update forecast display
function updateForecast(data) {
    forecastContainer.innerHTML = '';
    
    const forecastDays = data.forecast.forecastday;
    
    forecastDays.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Get temperatures based on selected unit
        let highTemp, lowTemp;
        if (temperatureUnit === 'c') {
            highTemp = Math.round(day.day.maxtemp_c);
            lowTemp = Math.round(day.day.mintemp_c);
        } else {
            highTemp = Math.round(day.day.maxtemp_f);
            lowTemp = Math.round(day.day.mintemp_f);
        }
        
        const condition = day.day.condition.text;
        const conditionCode = day.day.condition.code;
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'col-md-4 forecast-item';
        forecastItem.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-icon">
                <i class="fas ${getForecastIcon(conditionCode)}"></i>
            </div>
            <div class="forecast-temp">${highTemp}° / ${lowTemp}°</div>
            <div class="forecast-desc">${condition}</div>
        `;
        
        forecastContainer.appendChild(forecastItem);
    });
}

// Get forecast icon based on condition code
function getForecastIcon(conditionCode) {
    // Simplified mapping for forecast (using daytime icons)
    const iconMap = {
        // Sunny/Clear
        1000: 'fa-sun',
        
        // Cloudy
        1003: 'fa-cloud-sun',
        1006: 'fa-cloud',
        1009: 'fa-cloud',
        
        // Overcast
        1030: 'fa-smog',
        1135: 'fa-smog',
        1147: 'fa-smog',
        
        // Rain
        1063: 'fa-cloud-rain',
        1180: 'fa-cloud-rain',
        1183: 'fa-cloud-rain',
        1186: 'fa-cloud-rain',
        1189: 'fa-cloud-rain',
        1192: 'fa-cloud-rain',
        1195: 'fa-cloud-rain',
        
        // Snow
        1066: 'fa-snowflake',
        1114: 'fa-snowflake',
        1117: 'fa-snowflake',
        1210: 'fa-snowflake',
        1213: 'fa-snowflake',
        1216: 'fa-snowflake',
        1219: 'fa-snowflake',
        1222: 'fa-snowflake',
        1225: 'fa-snowflake',
        
        // Thunderstorm
        1087: 'fa-bolt',
        1273: 'fa-bolt',
        1276: 'fa-bolt'
    };
    
    return iconMap[conditionCode] || 'fa-cloud';
}

// Set loading state
function setLoadingState(isLoading) {
    const weatherCard = document.querySelector('.weather-card');
    if (isLoading) {
        weatherCard.classList.add('loading');
        currentTemp.textContent = `--°${temperatureUnit === 'c' ? 'C' : 'F'}`;
        weatherDescription.textContent = 'Loading...';
    } else {
        weatherCard.classList.remove('loading');
    }
}

// Show error message
function showError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const searchContainer = document.querySelector('.search-container');
    searchContainer.appendChild(errorDiv);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}