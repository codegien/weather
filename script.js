// get all icons to be displayed in the result
const weatherIcons = {
	clear: "https://cdn-icons-png.flaticon.com/512/869/869869.png", // Example sunny icon
	cloudy: "https://cdn-icons-png.flaticon.com/512/414/414927.png", // Example cloudy icon
	rain: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png", // Example rain icon
	snow: "https://cdn-icons-png.flaticon.com/512/642/642102.png", // Example snow icon
	default: "https://cdn-icons-png.flaticon.com/512/3313/3313998.png", // Default icon
};

// Get the user's location
const getWeather = async () => {
	const cityInput = document.getElementById("cityInput").value;
	if (!cityInput) {
		alert("Please enter a city name");
		return;
	}
	try {
		// fetch coordinates of the city from Open-Meteo's geocoding api
		const geoResponse = await fetch(
			`https://geocoding-api.open-meteo.com/v1/search?name=${cityInput}`
		);
		if (!geoResponse.ok) {
			throw new Error("Failed to fetch location data");
		}
		const geoData = await geoResponse.json();
		// console.log(geoData)
		if (!geoData.results || geoData.results.length === 0) {
			alert("No city found");
			return;
		}
		// console.log(geoData.results[0])
		const { latitude, longitude, name } = geoData.results[0];
		console.log(latitude, longitude, name);

		// fetch weather data using the coordinates
		const weatherResponse = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
		);
		if (!weatherResponse.ok) {
			throw new Error("Failed to fetch weather data");
		}
		const weatherData = await weatherResponse.json();
		const temperature = weatherData.current_weather.temperature;
		const weatherCode = weatherData.current_weather.weathercode;

		// Determine the appropriate weather icon from temperature
		let icon = weatherIcons.default;
		if (weatherCode === 0) {
			icon = weatherIcons.clear; //clear weather
		} else if ([1, 2, 3].includes(weatherCode)) {
			icon = weatherIcons.cloudy; //cloudy weather
		} else if ([51, 53, 61, 63].includes(weatherCode)) {
			icon = weatherIcons.rain; //rain weather
		} else if ([71, 73, 75].includes(weatherCode)) {
			icon = weatherIcons.snow; //snow weather
		}

		// Display result
		const result = document.getElementById("weatherResult");
		result.innerHTML = `
            <div class="city">${name}</div>
            <div class="temperature">
                <img src="${icon}" alt="Weather Icon">
                ${temperature}°C
            </div>
        `;
	} catch (err) {
		console.error(err);
		alert("Error fetching weather data: Please try again");
	}
};
