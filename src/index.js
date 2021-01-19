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

  let firstItem = response.data.list[0];
  //dt is in seconds & new date needs miliseconds.
  let date = new Date(firstItem.dt * 1000);
  let currentDay = date.getDay();
  let addedDay = false;
 0 {
    let date = new Date(dataDay.dt * 1000);
    let day = date.getDay();
    //check if the day changed to skip repeated days in the response.
    if (day !== currentDay) {
      currentDay = day;

      let forecastDay = document.createElement("div");
      forecastDay.classList.add("card");
      forecastDay.classList.add("col-12");
      forecastDay.classList.add("col-lg-2");
      // Add offset style only on the first day to have some margin.
      if (addedDay === false) {
        forecastDay.classList.add("offset-lg-1");
      }
      let forecastDayBody = document.createElement("div");
      forecastDayBody.classList.add("card-body");
      let forecastDayIcon = document.createElement("img");
      forecastDayIcon.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${dataDay.weather[0].icon}@2x.png`
      );
      let forecastDayTitle = document.createElement("h5");
      forecastDayTitle.classList.add("card-title");
      forecastDayTitle.innerHTML = days[date.getDay()];
      let forecastDayMin = document.createElement("p");
      forecastDayMin.innerHTML = `Min: ${Math.round(dataDay.main.temp_min)} °C`;
      let forecastDayMax = document.createElement("p");
      forecastDayMax.innerHTML = `Max: ${Math.round(dataDay.main.temp_max)} °C`;
      let forecastDayDescription = document.createElement("p");
      forecastDayDescription.classList.add("cards-text");
      forecastDayDescription.classList.add("capitalize");
      forecastDayDescription.innerHTML = dataDay.weather[0].description;

      //Appending elements in order
      forecastDayBody.appendChild(forecastDayIcon);
      forecastDayBody.appendChild(forecastDayMin);
      forecastDayBody.appendChild(forecastDayMax);
      forecastDayBody.appendChild(forecastDayDescription);
      forecastDay.appendChild(forecastDayTitle);
      forecastDay.appendChild(forecastDayBody);
      forecast.appendChild(forecastDay);
      addedDay = true;
    }
  });
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
