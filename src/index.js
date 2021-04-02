let API_KEY = "49e74429d3a2f98000aa1a8e998c37eb";
let API_URL = "https://api.openweathermap.org/data/2.5";

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", changeCityName);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", changeToCelsius);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let currentLocationBtn = document.querySelector("#current-location-btn");
currentLocationBtn.addEventListener("click", findCurrentLocation);

let now = new Date();
let currentDate = document.querySelector("#current-date");
let currentTime = document.querySelector("#current-time");
let date = now.getDate();
let hour = now.getHours().toString().padStart(2, "0");
let minutes = now.getMinutes().toString().padStart(2, "0");
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let currentDay = days[now.getDay()];
let year = now.getFullYear();
let months = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];
let number = now.getDate();

currentDate.innerHTML = `${currentDay} ${date} ${month}, ${year}`;
currentTime.innerHTML = `${hour}: ${minutes}`;

//challenge 2
function updateCurrentWeather(response) {
  console.log(response);
  let degrees = document.querySelector("#current-degrees");
  celsiusTemperature = response.data.main.temp;
  degrees.innerHTML = Math.round(celsiusTemperature);
  let description = response.data.weather[0].description;
  let currentWind = document.querySelector("#current-wind");
  currentWind.innerHTML = Math.round(response.data.wind.speed);
  let currentHumidity = document.querySelector("#current-humidity");
  currentHumidity.innerHTML = Math.round(response.data.main.humidity);
  let currentDescription = document.querySelector("#current-description");
  currentDescription.innerHTML = description;
  //Updating background color depending on the weather description. (like google does).
  let body = document.querySelector("body");
  if (description === "clear sky") {
    body.classList.remove("bad-weather-background");
    body.classList.add("good-weather-background");
  } else {
    body.classList.remove("good-weather-background");
    body.classList.add("bad-weather-background");
  }

  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;
  let iconElement = document.querySelector("#current-weather-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  // reset form after updating current weather to clear the search box.
  document.getElementById("search-form").reset();
}
function updateForecastWeather(response) {
  console.log(response.data.list);
  let forecast = document.querySelector("#forecast");
  forecast.innerHTML = "";
  let cardDeck = document.createElement("div");
  cardDeck.classList.add("card-deck");

  let firstItem = response.data.list[0];
  //dt is in seconds & new date needs miliseconds.
  let date = new Date(firstItem.dt * 1000);
  let currentDay = date.getDay();

  response.data.list.forEach(function (dataDay) {
    let date = new Date(dataDay.dt * 1000);
    let day = date.getDay();
    //check if the day changed to skip repeated days in the response.
    if (day !== currentDay) {
      console.log(day);
      currentDay = day;

      let forecastDay = document.createElement("div");
      forecastDay.classList.add("card");

      let forecastDayIcon = document.createElement("img");
      forecastDayIcon.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${dataDay.weather[0].icon}@2x.png`
      );
      forecastDayIcon.classList.add("weather-icon");

      let cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      let cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title");
      cardTitle.innerHTML = days[date.getDay()];

      let Min = document.createElement("span");
      Min.innerHTML = `Min:${Math.round(dataDay.main.temp_min)} °C`;

      let Max = document.createElement("span");
      Max.innerHTML = `Max:${Math.round(dataDay.main.temp_max)} °C`;

      let Description = document.createElement("span");
      Description.classList.add("capitalize");

      Description.innerHTML = dataDay.weather[0].description;

      forecastDay.appendChild(forecastDayIcon);
      forecastDay.appendChild(cardBody);
      forecastDay.appendChild(cardTitle);
      forecastDay.appendChild(Min);
      forecastDay.appendChild(Max);
      forecastDay.appendChild(Description);

      cardDeck.appendChild(forecastDay);
    }
  });
  forecast.appendChild(cardDeck);
}

function changeCityName(event) {
  console.log(event);
  event.preventDefault();

  let formInput = document.querySelector("#search-form-input");
  let units = "metric";
  let cityName = formInput.value.trim();
  if (cityName !== "") {
    let apiUrl = `${API_URL}/weather?q=${cityName}&units=${units}&appid=${API_KEY}`;
    axios.get(apiUrl).then(updateCurrentWeather);
    let apiForecastUrl = `${API_URL}/forecast?q=${cityName}&units=${units}&appid=${API_KEY}`;
    axios.get(apiForecastUrl).then(updateForecastWeather);
  }
}

// challenge 3
function changeToCelsius(event) {
  event.preventDefault();
  let degrees = document.querySelector("#current-degrees");
  fahrenheitLink.classList.remove("active");
  celsius.classList.add("active");
  degrees.innerHTML = Math.round(celsiusTemperature);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let degrees = document.querySelector("#current-degrees");
  celsius.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let currentDegrees = degrees.innerHTML;
  currentDegrees = Number(currentDegrees);
  degrees.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
}

//Next challenge
function updateCurrentLocation(currentPosition) {
  let lat = currentPosition.coords.latitude;
  let long = currentPosition.coords.longitude;
  let units = "metric";

  axios
    .get(
      `${API_URL}/weather?lat=${lat}&lon=${long}&units=${units}&appid=${API_KEY}`
    )
    .then(updateCurrentWeather);
  let apiForecastUrl = `${API_URL}/forecast?lat=${lat}&lon=${long}&units=${units}&appid=${API_KEY}`;
  axios.get(apiForecastUrl).then(updateForecastWeather);
}
function findCurrentLocation() {
  navigator.geolocation.getCurrentPosition(updateCurrentLocation);
}

let celsiusTemperature = null;

//loading weather for current location when page loads
findCurrentLocation();
