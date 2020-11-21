let API_KEY = "49e74429d3a2f98000aa1a8e998c37eb";
let API_URL = "https://api.openweathermap.org/data/2.5/weather";

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
  degrees.innerHTML = Math.round(response.data.main.temp);
  let currentWind = document.querySelector("#current-wind");
  currentWind.innerHTML = Math.round(response.data.wind.speed);
  let currentHumidity = document.querySelector("#current-humidity");
  currentHumidity.innerHTML = Math.round(response.data.main.humidity);
  let currentDescription = document.querySelector("#current-description");
  currentDescription.innerHTML = response.data.weather[0].description;
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

function changeCityName(event) {
  console.log(event);
  event.preventDefault();

  let formInput = document.querySelector("#search-form-input");
  let units = "metric";
  let cityName = formInput.value.trim();
  if (cityName !== "") {
    let apiUrl = `${API_URL}?q=${cityName}&units=${units}&appid=${API_KEY}`;
    axios.get(apiUrl).then(updateCurrentWeather);
  }
}

// challenge 3
function changeToCelsius(event) {
  event.preventDefault();
  let degrees = document.querySelector("#current-degrees");
  degrees.innerHTML = "20";
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let degrees = document.querySelector("#current-degrees");
  let currentDegrees = degrees.innerHTML;
  currentDegrees = Number(currentDegrees);
  degrees.innerHTML = Math.round((currentDegrees * 9) / 5 + 32);
}

//Next challenge
function updateCurrentLocation(currentPosition) {
  let lat = currentPosition.coords.latitude;

  let long = currentPosition.coords.longitude;
  let units = "metric";

  axios
    .get(`${API_URL}?lat=${lat}&lon=${long}&units=${units}&appid=${API_KEY}`)
    .then(updateCurrentWeather);
}
function findCurrentLocation() {
  navigator.geolocation.getCurrentPosition(updateCurrentLocation);
}

//loading weather for current location when page loads
findCurrentLocation();
