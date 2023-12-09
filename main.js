const apiKey = "";//place your Api key here. I used API form  https://openweathermap.org/api  for this project.
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
const revApiUrl = "http://api.openweathermap.org/geo/1.0/reverse?";
 

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector(".weather-icon");
const errorMessage = document.querySelector(".error");
const suggestion_container = document.querySelector(".suggestion_container");


//getting users current location to forecast the weather in user location
// Function to get the city name from latitude and longitude
async function getCityName(latitude, longitude) {
    // Replace with the URL of the reverse geocoding API you are using
    const apiUrl = revApiUrl +  `&appid=${apiKey}`;

    try {
        const response = await fetch(`${apiUrl}&lon=${longitude}&lat=${latitude}`);
        const data = await response.json();

        console.log(data);

        // Assuming the API returns a JSON object with a city name
        return data[0].name; // Adjust this depending on the API response format
    } catch (error) {
        console.error('Error getting city name:', error);
        return null;
    }
}

// Function to request user's location and display city name
function requestLocationAndDisplayCity() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude =  position.coords.latitude;
            const longitude = position.coords.longitude; 

            console.log(latitude);
            console.log(longitude);
            // Get city name using latitude and longitude
            const cityName = await getCityName(latitude, longitude);

            if (cityName) {
                console.log(`${cityName}`);
                searchBox.value = `${cityName}`;
                checkWeather(searchBox.value);
                document.querySelector("#inputText").value = "";

               
            } else {
                console.log('City name not found');
            }
        }, (error) => {
            console.error('Error getting location:', error);
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

// Call the function to initiate the process
requestLocationAndDisplayCity();






async function checkWeather(city){
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    var data = await response.json();

    if (response.status == 404){
        errorMessage.style.display = "block";
    }else {
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/hr";
        document.querySelector(".weatherCondition").innerHTML = data.weather[0].description;



        if (data.weather[0].main == "Clouds"){
            weatherIcon.src = "./images/clouds.png";
            suggestion_container.innerHTML = `It is cloudy today. <br> It might rain. <br> Don't forget to carry an umbrella.`;

        }else if (data.weather[0].main == "Clear"){
            weatherIcon.src = "./images/clear.png";
            suggestion_container.innerHTML =`It is clear and sunny Today. <br> Make sure to hydrate yourself. <br> Enjoy this Beautiful Day!`

        }else if (data.weather[0].main == "Rain"){
            weatherIcon.src = "./images/rain.png";
            suggestion_container.innerHTML = `It is raining now. <br> Don't forget to carry an umbrella. <br> Watch your steps, it might be slippery!`;

        }else if (data.weather[0].main == "Drizzle"){
            weatherIcon.src = "./images/drizzle.png";
            suggestion_container.innerHTML = `There is light rain now. <br> Don't forget to carry an umbrella. <br> Drivers Please! be cautious. Roads are slippery in such weather condition.`

        }else if (data.weather[0].main == "Mist"){
            weatherIcon.src = "./images/mist.png";
            suggestion_container.innerHTML = `It's misty today. <br>  Warning! for drivers <br> Poor visibility, Please! drive slow.`
        }

        errorMessage.style.display = "none";
    }
    console.log(data);
}

searchBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

searchBtn.addEventListener("click",() => {
    checkWeather(searchBox.value);
    document.querySelector("#inputText").value = "";
});






