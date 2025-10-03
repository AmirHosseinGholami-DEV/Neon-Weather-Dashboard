document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const body = document.body;
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const unitToggle = document.getElementById('unit-toggle');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const refreshBtn = document.getElementById('refresh-btn');
    const addFavoriteBtn = document.getElementById('add-favorite');
    const toast = document.getElementById('toast');
    const loadingOverlay = document.getElementById('loading-overlay');
    const backgroundElements = document.getElementById('background-elements');
    
    // App State
    let currentCity = 'London';
    let isCelsius = true;
    let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    
    // Initialize the app
    initApp();
    
    // Event Listeners
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
    
    searchBtn.addEventListener('click', searchWeather);
    unitToggle.addEventListener('click', toggleUnits);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    refreshBtn.addEventListener('click', refreshWeather);
    addFavoriteBtn.addEventListener('click', addToFavorites);
    
    // Functions
    function initApp() {
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            body.classList.add('dark');
        }
        
        // Load favorites from localStorage
        updateFavoritesList();
        
        // Load initial weather
        fetchWeather(currentCity, isCelsius);
        
        // Generate background elements
        createBackgroundElements();
    }
    
    function createBackgroundElements() {
        // Clear existing elements
        backgroundElements.innerHTML = '';
        
        // Create clouds
        for (let i = 0; i < 8; i++) {
            const cloud = document.createElement('div');
            cloud.classList.add('weather-cloud');
            
            // Random size and position
            const size = Math.random() * 100 + 50;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 20;
            
            cloud.style.width = `${size}px`;
            cloud.style.height = `${size * 0.6}px`;
            cloud.style.left = `${posX}%`;
            cloud.style.top = `${posY}%`;
            cloud.style.animationDelay = `-${delay}s`;
            
            backgroundElements.appendChild(cloud);
        }
    }
    
    function searchWeather() {
        const city = searchInput.value.trim();
        if (city) {
            currentCity = city;
            fetchWeather(city, isCelsius);
        }
    }
    
    function toggleUnits() {
        isCelsius = !isCelsius;
        unitToggle.textContent = isCelsius ? '°C / °F' : '°F / °C';
        fetchWeather(currentCity, isCelsius);
    }
    
    function toggleDarkMode() {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        
        // Update weather icon for dark mode
        updateWeatherIconBasedOnBackground();
    }
    
    function refreshWeather() {
        fetchWeather(currentCity, isCelsius);
    }
    
    function addToFavorites() {
        if (!currentCity) return;
        
        // Check if already in favorites
        if (!favorites.includes(currentCity)) {
            favorites.push(currentCity);
            localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
            updateFavoritesList();
            showToast('Added to favorites!', 'success');
        } else {
            showToast('Already in favorites', 'info');
        }
    }
    
    function updateFavoritesList() {
        const favoritesList = document.getElementById('favorites-list');
        favoritesList.innerHTML = '';
        
        if (favorites.length === 0) {
            favoritesList.innerHTML = '<div class="text-center text-gray-500 dark:text-gray-400 col-span-3">No favorites added yet</div>';
            return;
        }
        
        favorites.forEach(city => {
            const card = document.createElement('div');
            card.className = 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer';
            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <h4 class="font-medium text-gray-800 dark:text-gray-200">${city}</h4>
                    <button class="remove-favorite text-red-500 hover:text-red-700 dark:hover:text-red-400" data-city="${city}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">Click to view</div>
            `;
            
            card.addEventListener('click', () => {
                currentCity = city;
                fetchWeather(city, isCelsius);
                searchInput.value = city;
            });
            
            favoritesList.appendChild(card);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-favorite').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const cityToRemove = this.getAttribute('data-city');
                favorites = favorites.filter(c => c !== cityToRemove);
                localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
                updateFavoritesList();
                showToast('Removed from favorites', 'info');
            });
        });
    }
    
    function fetchWeather(city, useCelsius = true) {
        showLoading();
        
        // In a real app, you would use the OpenWeatherMap API
        // For this example, we'll simulate API response
        setTimeout(() => {
            // Simulate API response
            const weatherData = {
                city: city,
                country: "Simulated Country",
                temp_c: Math.round(15 + Math.random() * 15),
                temp_f: Math.round(59 + Math.random() * 27),
                feels_like_c: Math.round(14 + Math.random() * 15),
                feels_like_f: Math.round(57 + Math.random() * 27),
                humidity: Math.round(40 + Math.random() * 50),
                wind_kph: Math.round(5 + Math.random() * 20),
                pressure_mb: Math.round(980 + Math.random() * 40),
                condition: {
                    text: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorm"][Math.floor(Math.random() * 5)],
                    icon: ""
                },
                sunrise: "06:" + Math.floor(10 + Math.random() * 50).toString().padStart(2, '0'),
                sunset: (18 + Math.floor(Math.random() * 2)) + ":" + Math.floor(10 + Math.random() * 50).toString().padStart(2, '0'),
                forecast: Array(5).fill().map((_, i) => ({
                    date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
                    temp_c: Math.round(12 + Math.random() * 18),
                    temp_f: Math.round(54 + Math.random() * 32),
                    condition: {
                        text: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Thunderstorm"][Math.floor(Math.random() * 5)]
                    }
                }))
            };
            
            updateWeatherUI(weatherData, useCelsius);
            updateWeatherBackground(weatherData.condition.text);
            
            hideLoading();
        }, 1000);
        
        // In a real implementation, you would use fetch() to call the API:
        /*
        const apiKey = 'YOUR_API_KEY';
        const unit = useCelsius ? 'metric' : 'imperial';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('City not found');
                return response.json();
            })
            .then(data => {
                updateWeatherUI(data, useCelsius);
                updateWeatherBackground(data.weather[0].main);
                hideLoading();
            })
            .catch(error => {
                showToast(error.message, 'error');
                hideLoading();
            });
        */
    }
    
    function updateWeatherUI(data, useCelsius) {
        // Update current weather
        document.getElementById('city-name').textContent = `${data.city}, ${data.country}`;
        document.getElementById('current-temp').textContent = useCelsius ? data.temp_c : data.temp_f;
        document.getElementById('feels-like').textContent = useCelsius ? `${data.feels_like_c}°` : `${data.feels_like_f}°`;
        document.getElementById('humidity').textContent = `${data.humidity}%`;
        document.getElementById('wind-speed').textContent = `${data.wind_kph} km/h`;
        document.getElementById('pressure').textContent = `${data.pressure_mb} hPa`;
        document.getElementById('weather-desc').textContent = data.condition.text;
        document.getElementById('sunrise').textContent = data.sunrise;
        document.getElementById('sunset').textContent = data.sunset;
        
        // Update weather icon
        updateWeatherIcon(data.condition.text);
        
        // Update forecast
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '';
        
        data.forecast.forEach(day => {
            const forecastCard = document.createElement('div');
            forecastCard.className = 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300';
            
            const dateStr = day.date.toLocaleDateString('en-US', { weekday: 'short' });
            const temp = useCelsius ? day.temp_c : day.temp_f;
            
            forecastCard.innerHTML = `
                <div class="text-center">
                    <div class="font-semibold text-gray-800 dark:text-gray-200">${dateStr}</div>
                    <div class="my-3 text-4xl">${getWeatherEmoji(day.condition.text)}</div>
                    <div class="text-gray-600 dark:text-gray-400 text-sm">${day.condition.text}</div>
                    <div class="mt-2 font-bold text-xl">${temp}°</div>
                </div>
            `;
            
            forecastContainer.appendChild(forecastCard);
        });
    }
    
    function updateWeatherIcon(condition) {
        const iconElement = document.getElementById('weather-icon');
        iconElement.innerHTML = '';
        
        const icon = document.createElement('i');
        icon.className = 'text-8xl';
        
        // Add animation class based on condition
        if (condition.toLowerCase().includes('sun')) {
            icon.classList.add('fas', 'fa-sun', 'sun-animation', 'text-yellow-400');
        } else if (condition.toLowerCase().includes('cloud')) {
            icon.classList.add('fas', 'fa-cloud', 'text-gray-400');
        } else if (condition.toLowerCase().includes('rain')) {
            icon.classList.add('fas', 'fa-cloud-rain', 'text-blue-400');
        } else if (condition.toLowerCase().includes('thunder')) {
            icon.classList.add('fas', 'fa-bolt', 'text-yellow-500');
        } else {
            icon.classList.add('fas', 'fa-cloud-sun', 'text-blue-300');
        }
        
        iconElement.appendChild(icon);
        updateWeatherIconBasedOnBackground();
    }
    
    function updateWeatherIconBasedOnBackground() {
        const icon = document.querySelector('#weather-icon i');
        if (!icon) return;
        
        if (body.classList.contains('dark')) {
            // Make icons more vibrant in dark mode
            if (icon.classList.contains('text-yellow-400')) {
                icon.classList.replace('text-yellow-400', 'text-yellow-300');
            }
            if (icon.classList.contains('text-blue-400')) {
                icon.classList.replace('text-blue-400', 'text-blue-300');
            }
        } else {
            // Revert to original colors in light mode
            if (icon.classList.contains('text-yellow-300')) {
                icon.classList.replace('text-yellow-300', 'text-yellow-400');
            }
            if (icon.classList.contains('text-blue-300')) {
                icon.classList.replace('text-blue-300', 'text-blue-400');
            }
        }
    }
    
    function updateWeatherBackground(condition) {
        // Clear any existing weather effects
        document.querySelectorAll('.raindrop').forEach(el => el.remove());
        
        if (condition.toLowerCase().includes('rain')) {
            // Add raindrops
            for (let i = 0; i < 30; i++) {
                const raindrop = document.createElement('div');
                raindrop.classList.add('raindrop');
                
                const left = Math.random() * 100;
                const delay = Math.random() * 2;
                const duration = 0.5 + Math.random() * 1;
                
                raindrop.style.left = `${left}%`;
                raindrop.style.animationDelay = `-${delay}s`;
                raindrop.style.animationDuration = `${duration}s`;
                
                backgroundElements.appendChild(raindrop);
            }
        }
    }
    
    function getWeatherEmoji(condition) {
        condition = condition.toLowerCase();
        if (condition.includes('sun')) return '☀️';
        if (condition.includes('cloud')) return '⛅';
        if (condition.includes('rain')) return '🌧️';
        if (condition.includes('thunder')) return '⛈️';
        return '🌤️';
    }
    
    function showToast(message, type = 'error') {
        toast.textContent = message;
        toast.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50`;
        
        if (type === 'error') {
            toast.classList.add('bg-red-500', 'text-white');
        } else if (type === 'success') {
            toast.classList.add('bg-green-500', 'text-white');
        } else {
            toast.classList.add('bg-blue-500', 'text-white');
        }
        
        toast.classList.remove('hidden');
        toast.classList.add('toast');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
    
    function showLoading() {
        loadingOverlay.classList.remove('hidden');
    }
    
    function hideLoading() {
        loadingOverlay.classList.add('hidden');
    }
});