$('#search-btn').on('click', search);
$('#card-container').on('click', (e) => toggleTempDisplay(e));

async function search() {
  const zip = $('#search-input').val();
  const initialFetch = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=e8f0baa7772713571ca243de47d6139d&zip=${zip}`);
  const weatherData = await initialFetch.json();
  cleanData(weatherData)
}

function cleanData(weatherData) {
  const forecastObj = weatherData.list.reduce((weatherObj, forecast) => {
    const date = forecast.dt_txt.split(' ')[0];
    !weatherObj[date] ? weatherObj[date] = [forecast] : weatherObj[date] = [...weatherObj[date], forecast];
    return weatherObj;
  }, {});

  renderCards(forecastObj);
}

function renderCards(forecastObj) {
  let days = Object.keys(forecastObj);
  days.shift();

  days.forEach(day => {
    const formattedDate = new Date(day).toDateString();
    $('#card-container').append(`
      <div id=${day} class='card'>
        <h2>${formattedDate}</h2>
        <img id='main-pic' src='http://openweathermap.org/img/w/${forecastObj[day][5].weather[0].icon}.png'/>
        <footer class='show-more'>
          <img class='arrow-icon' src='https://www.iconsdb.com/icons/preview/color/D9D9D9/arrow-204-xxl.png'/>
        </footer>
      </div>
    `);

    days.forEach(day => {
      forecastObj[day].forEach(forecast => {
        const date = forecast.dt_txt.split(' ');
        const time = moment(date[1], 'HH:mm:ss').format('h A');
        let { temp } = forecast.main;
        temp = Math.round((temp * 9/5) - 459.67);

        $(`#${date[0]}`).append(`
          <div class='temp-area dont-show' id=${date[0]}>
            <p>${time}</p>
            <image src='http://openweathermap.org/img/w/${forecast.weather[0].icon}.png'/>
            <p>${temp}&#8457</p>
          </div>
      `);
      });
    });
  });
}

function toggleTempDisplay(e) {
  if ($(e.target).hasClass('show-more')) {
    let siblings = $(e.target).siblings();
    siblings.splice(0, 2);
    $(siblings).toggleClass('dont-show');
  }
}
