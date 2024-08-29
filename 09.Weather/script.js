const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");

weatherForm.addEventListener("submit", async event => {
  event.preventDefault();

  const city = cityInput.value;

  if (city) {
    try {
      const weatherData = await getWeatherData(city);
      console.log("Weather Data:", weatherData); // Log the weather data

      const savedData = await saveWeatherData(weatherData);
      console.log("Saved Data:", savedData); // Log the saved data
      
      // Assuming savedData should be displayed, but ensure this aligns with actual response
      displayWeatherInfo([savedData]);
    } catch (error) {
      console.error("Error:", error); // Log the error message
      displayError(error.message);
    }
  } else {
    displayError("Please enter a city");
  }
});

async function getWeatherData(city) {
  const apiKey = "3eb452f49ff0402095fcdc5853e43d1b";
  const apiUrl = `https://api.weatherbit.io/v2.0/current?city=${city}&country=MD&key=${apiKey}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  console.log("Weather Data:", data); // Log the weather data
  if (!response.ok) {
    throw new Error("Could not fetch weather data");
  }

  return data;
}

async function saveWeatherData(weatherData) {
  const { city_name: city, temp, app_temp: feels_like, weather } = weatherData.data[0];
  const description = weather ? weather.description : 'No description available';
  const apiUrl = "http://127.0.0.1:8000/weather/";

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      city: city,
      temperature: temp,
      feels_like: feels_like,
      description: description
    })
  });

  if (!response.ok) {
    throw new Error("Could not save weather data");
  }

  return await response.json();
}

function convertUTCToLocal(utcDateString) {
  // Create a Date object from the UTC date string
  const utcDate = new Date(utcDateString);
  
  // Convert to local time string
  return utcDate.toLocaleString();  // This will use the local time zone of the user's system
}

function displayWeatherInfo(weatherData) {
  if (Array.isArray(weatherData) && weatherData.length > 0) {
    card.textContent = "";
    card.style.display = "flex";

    weatherData.forEach(data => {
      const { city, temperature, feels_like, description } = data;

      const cityDisplay = document.createElement("h1");
      const tempDisplay = document.createElement("p");
      const feelsLikeDisplay = document.createElement("p");
      const descDisplay = document.createElement("p");

      cityDisplay.textContent = city;
      tempDisplay.textContent = `${temperature}°C`;
      feelsLikeDisplay.textContent = `Feels Like: ${feels_like}°C`;
      descDisplay.textContent = description;

      cityDisplay.classList.add("cityDisplay");
      tempDisplay.classList.add("tempDisplay");
      feelsLikeDisplay.classList.add("feelsLikeDisplay");
      descDisplay.classList.add("descDisplay");

      card.appendChild(cityDisplay);
      card.appendChild(tempDisplay);
      card.appendChild(feelsLikeDisplay);
      card.appendChild(descDisplay);
    });
  } else {
    displayError("Invalid weather data received");
  }
}


function displayError(message) {
  console.error(message); // Log the error message
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  card.textContent = "";
  card.style.display = "flex";
  card.appendChild(errorDisplay);
}
