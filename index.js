$('#search-btn').on('click', search);

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
  console.log(forecastObj)

  days.forEach(day => {
    const formattedDate = new Date(day).toDateString();
    $('#card-container').append(`
      <div id='${day} class='card'>
        <h2>${formattedDate}</h2>
        <img id='main-pic' src='http://openweathermap.org/img/w/${forecastObj[day][5].weather[0].icon}.png'/>
        <footer></footer>
      </div>
    `)
  });
}
