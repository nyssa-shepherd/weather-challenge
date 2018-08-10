const search = async() => {
  const zip = $('#search-input').val();
  const initialFetch = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=e8f0baa7772713571ca243de47d6139d&zip=${zip}`);
  const data = await initialFetch.json();
  console.log(data);
}

$('#search-btn').on('click', search);
