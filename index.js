$('#search-btn').on('click', search);
$('#search-area').on('submit', (e) => search(e));
$('#card-container').on('click', (e) => toggleTempDisplay(e));


function search(e) {
  e.preventDefault();
  const location = $('#search-input').val().toLowerCase();
  $('.card').remove();
  $('#search-input').val('');
  !localStorage[location] ? fetchData(location) : getFromLocalStorage(location);
}

async function fetchData(location) {
  const type = typeof parseInt(location) === 'integer' ? 'zip' : 'q';
  const initialFetch = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=e8f0baa7772713571ca243de47d6139d&${type}=${location}`);
  const weatherData = await initialFetch.json();
  cleanData(weatherData, location);
}

function getFromLocalStorage(location) {
  const weatherData = JSON.parse(localStorage.getItem([location]));
  renderCards(weatherData);
}


function cleanData(weatherData, location) {
  forecastObj = weatherData.list.reduce((weatherObj, forecast) => {
    const date = forecast.dt_txt.split(' ')[0];
    !weatherObj[date] ? weatherObj[date] = [] : null;
    weatherObj[date].push(forecast);
    return weatherObj;
  }, {});

  localStorage.setItem([location], JSON.stringify(forecastObj));
  renderCards(forecastObj);
}

function findAvgTemp(day, forecastObj, type) {
  let average = forecastObj[day].reduce((avg, forecast) => {
    avg += forecast.main[type];
    return Math.round(avg / forecastObj[day].length);
  }, 0);
  return average;
}

function renderCards(forecastObj) {
  let days = Object.keys(forecastObj);
  days.shift();

  days.forEach(day => {
    const date = new Date(day).toDateString();

    $('#card-container').append(`
      <div id=${day} class='card'>
          <h2>${date}</h2>
          <img id='main-pic' src='http://openweathermap.org/img/w/${forecastObj[day][5].weather[0].icon}.png'/>
          <h3>${findAvgTemp(day, forecastObj, 'temp_min')}&#8457 | ${findAvgTemp(day, forecastObj, 'temp_max')}&#8457</h3>
        <footer class='show-more'>
          <img class='arrow-icon' src='https://www.iconsdb.com/icons/preview/color/D9D9D9/arrow-204-xxl.png'/>
        </footer
      </div>
    `);
  });


  days.forEach(day => {
    forecastObj[day].forEach(forecast => {
      const date = forecast.dt_txt.split(' ');
      const time = moment(date[1], 'HH:mm:ss').format('h A');
      const temp = Math.round((forecast.main.temp * 9/5) - 459.67);

      $(`#${date[0]}`).append(`
        <div class='temp-area dont-show' id=${date[0]}>
          <p>${time}</p>
          <image src='http://openweathermap.org/img/w/${forecast.weather[0].icon}.png'/>
          <p>${temp}&#8457</p>
        </div>
      `);
    });
  });
}

function toggleTempDisplay(e) {
  if ($(e.target).hasClass('show-more')) {
    let siblings = $(e.target).siblings();
    siblings.splice(0, 3);
    $(siblings).toggleClass('dont-show');
  }
}
