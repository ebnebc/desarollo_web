document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast');
    const weatherDataDiv = document.getElementById('weather-data');
    const errorMessage = document.getElementById('error-message');

    const API_KEY = 'dbbce24a49d6a3efd28fc3a3ea046e44'; 
    const BASE_URL = 'https://home.openweathermap.org/api_keys';

    const fetchWeather = async (city) => {
        errorMessage.textContent = '';
        currentWeatherDiv.innerHTML = '';
        forecastDiv.innerHTML = '<h2>Pronóstico para los próximos días</h2>';
        weatherDataDiv.style.display = 'none';

        if (!API_KEY || API_KEY === 'TU_API_KEY') {
            console.warn('API key no configurada. Añade tu clave de OpenWeatherMap.');
            return;
        }

        try {
            const currentResponse = await fetch(`${BASE_URL}weather?q=${city},MX&lang=es&units=metric&appid=${API_KEY}`);
            if (!currentResponse.ok) {
                const errorData = await currentResponse.json();
                throw new Error(`Ciudad no encontrada o error: ${errorData.message}`);
            }
            const currentData = await currentResponse.json();
            displayCurrentWeather(currentData);

            const forecastResponse = await fetch(`${BASE_URL}forecast?q=${city},MX&lang=es&units=metric&appid=${API_KEY}`);
            if (!forecastResponse.ok) {
                throw new Error('Error al obtener el pronóstico extendido.');
            }
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);

            weatherDataDiv.style.display = 'block';

        } catch (error) {
            errorMessage.textContent = `Error: ${error.message}. Por favor, verifica el nombre de la ciudad y tu clave API.`;
        }
    };
    
    // ... el resto del código igual ...
});