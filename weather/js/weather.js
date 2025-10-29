document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-button');
    const currentWeatherDiv = document.getElementById('current-weather');
    const forecastDiv = document.getElementById('forecast');
    const weatherDataDiv = document.getElementById('weather-data');
    const errorMessage = document.getElementById('error-message');

    const API_KEY = 'TU_API_KEY'; 
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

    const fetchWeather = async (city) => {
        errorMessage.textContent = '';
        currentWeatherDiv.innerHTML = '';
        forecastDiv.innerHTML = '<h2>Pronóstico para los próximos días</h2>';
        weatherDataDiv.style.display = 'none';

        if (!API_KEY || API_KEY === 'TU_API_KEY') {
            console.warn('API key de OpenWeatherMap no configurada.');
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

    const displayCurrentWeather = (data) => {
        const temp = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;

        currentWeatherDiv.innerHTML = `
            <h3 class="city-name">${data.name}, ${data.sys.country}</h3>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <p class="temperature">${temp}°C</p>
            <p class="description">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
            <div class="details">
                <p>Viento: ${windSpeed} m/s</p>
                <p>Humedad: ${humidity}%</p>
            </div>
        `;
    };

    const displayForecast = (data) => {
        const dailyForecasts = {};
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = { temps: [], icon: item.weather[0].icon };
            }
            dailyForecasts[date].temps.push(item.main.temp);
        });

        let count = 0;
        for (const date in dailyForecasts) {
            if (count >= 1 && count <= 4) {
                const temps = dailyForecasts[date].temps;
                const maxTemp = Math.round(Math.max(...temps));
                const minTemp = Math.round(Math.min(...temps));
                const iconCode = dailyForecasts[date].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
                const dayName = new Date(date).toLocaleDateString('es-MX', { weekday: 'long' });

                const dayCard = document.createElement('div');
                dayCard.classList.add('day-card');
                dayCard.innerHTML = `
                    <strong>${dayName.charAt(0).toUpperCase() + dayName.slice(1)}</strong>
                    <img src="${iconUrl}" alt="Icono de clima" class="weather-icon">
                    <span>${maxTemp}°C / ${minTemp}°C</span>
                `;
                forecastDiv.appendChild(dayCard);
            }
            count++;
        }
    };

    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
        } else {
            errorMessage.textContent = 'Por favor, ingresa el nombre de una ciudad.';
        }
    });

    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    fetchWeather('Ciudad de México'); 
});
