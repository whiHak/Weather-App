const cityInput = $("#city-name");
const searchBtn = $(".search");
const currentLocationBtn = $(".curr-location-btn");
const cards = $(".forcast-cards");
const card = $(".card");
const forcastedCityName = $(".city-name");
const tempStatus = $("#temp-status");
const currentTemp = $("#current-temp");
const currentDate = $(".dateA");
const backImg = $("#main-img");
const body = $("body");

const newDiv = (obj) => {
  return $("<div>")
    .addClass("card")
    .attr("description", `${obj.weather[0].description}`).html(`
    <p class="date">${obj.dt_txt.split(" ")[0]}</p>
    <img src="https://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png">
    <p class="temp">Temp: ${(+obj.main.temp - 273.15).toFixed(2)}°c</p>
    <p class="wind">Wind: ${obj.wind.speed}M/S</p>
    <p class="Humidity">Humidity: ${obj.main.humidity}%</p>
    `);
};

function getCity() {
  const cityName = cityInput.val().trim();
  if (!cityName) return; // exits function if there is no input
  const APIUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`;

  $.get(APIUrl)
    .done((response, status) => {
      // console.log(status);
      if (!response.length)
        return alert(`NO city found with a name '${cityName}'`);
      const { name, lon, lat } = response[0];
      getWeatherInfo(name, lon, lat);
    })
    .fail(() => {
      alert("Error while fetching API");
    });
}

function getWeatherInfo(name, lon, lat) {
  const APIUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

  $.get(APIUrl)
    .done((response, status) => {
      console.log(status);
      const days = [];
      const filteredResponse = response.list.filter((obj) => {
        const date = new Date(obj.dt_txt).getDate();
        if (!days.includes(date)) {
          return days.push(date);
        }
      });
      cards.empty();
      cityInput.val("");
      filteredResponse.forEach((obj) => {
        cards.append(newDiv(obj));
      });
      forcastedCityName.text(name);
      tempStatus.text(filteredResponse[0].weather[0].main);
      currentTemp.text(
        (filteredResponse[0].main.temp - 273.15).toFixed(2) + "°c"
      );

      tempStatus.val(filteredResponse[0].weather[0].description);
      changeBack(tempStatus.val());
    })
    .fail(() => {
      alert("Error while fetching API");
    });
}

changeBack = (prop) => {
  switch (prop) {
    case "Sunny":
      body.css("background", "url(../Images/sunny.jpg)");
      backImg.attr("src", "./Images/sunny.jpg");
      break;
    case "clear sky":
      body.css("background", "url(../Images/clear.jpg)");
      backImg.attr("src", "./Images/clear.jpg");
      break;
    case "broken clouds":
      body.css("background", "url(../Images/broken-clouds.jpg)");
      backImg.attr("src", "./Images/broken-clouds.jpg");
      break;
    case "few clouds":
      body.css("background", "url(../Images/few-clouds.jpg)");
      backImg.attr("src", "./Images/few-clouds.jpg");
      break;
    case "scattered clouds":
      body.css("background", "url(../Images/cloudy.jpg)");
      backImg.attr("src", "./Images/cloudy.jpg");
      break;
    case "moderate rain":
    case "light rain":
      body.css("background", "url(../Images/rainny.jpg)");
      backImg.attr("src", "./Images/rainny.jpg");
      break;
    case "thunderstorm":
      body.css("background", "url(../Images/lightning1.jpg)");
      backImg.attr("src", "./Images/lightning1.jpg");
      break;
    case "mist":
      body.css("background", "url(../Images/mist.jpg)");
      backImg.attr("src", "./Images/mist.jpg");
      break;
    case "snow":
    case "light snow":
      body.css("background", "url(../Images/snow.jpg)");
      backImg.attr("src", "./Images/snow.jpg");
      break;
    case "mist":
      body.css("background", "url(../Images/mist.jpg)");
      backImg.attr("src", "./Images/mist.jpg");
    case "snow":
      body.css("background", "url(../Images/snow.jpg)");
      backImg.attr("src", "./Images/snow.jpg");
    default:
      body.css("background", "url(../Images/broken-clouds.jpg)");
      backImg.attr("src", "./Images/broken-clouds.jpg");
  }
};
body.css("background", "url(../Images/broken-clouds.jpg)");
backImg.attr("src", "./Images/broken-clouds.jpg");

const date = new Date();
currentDate.text(date);

searchBtn.click(getCity);
const getCoordinate = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    $.get(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=${APIKey}`
    )
      .done((response, status) => {
        const { name, lon, lat } = response[0];
        getWeatherInfo(name, lon, lat);
      })
      .fail(() => {
        alert("Somthing went wrong");
      });
    console.log(position.coords),
      (error) => {
        console.log(error);
      };
  });
};
currentLocationBtn.click(getCoordinate);

cityInput.keyup(function (event) {
  if (event.which === 13) getCity();
});
cards.on("click", ".card", function () {
  const clickedCard = $(this);
  const attributeValue = clickedCard.attr("description");
  tempStatus.text(attributeValue);
  changeBack(attributeValue);
});
