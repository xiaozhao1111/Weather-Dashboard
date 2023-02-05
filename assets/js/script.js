let cityGeo = { lon: '', lat: ''}
let cityName = '';


// Get the geographical coordinates information based on the city name in the input-form 
function getGeoInfo() {
    // Build the queryURL from the input-form
    let geocodingURL = 'http://api.openweathermap.org/geo/1.0/direct?';
    let geocodingParams = {'appid': '6d15a98c4f1e6bf4dce53c48165b4e99'};
    geocodingParams.q = cityName;
    // console.log the URL
    // console.log(geocodingURL + $.param(geocodingParams));
    geocodingURL += $.param(geocodingParams);

    
    // Make the AJAX request to the Geocoding API, and get the JSON data
    $.ajax({
        url: geocodingURL,
        method: 'GET',
    }).then(function(response){
        cityGeo.lon = response[0].lon,
        cityGeo.lat = response[0].lat
    });
}

// Get current 
function getCurrentWeather() {
    // Build the queryURL based on the lon and lat data 
    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?';
    let queryParams = {
    'appid': '6d15a98c4f1e6bf4dce53c48165b4e99'
    }
    queryParams.lat = cityGeo.lat;
    queryParams.lon = cityGeo.lon;
    queryURL += $.param(queryParams);
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){
        console.log(response);
        //Empty the previous weather data
        $('#today').empty();
        $('#forecast').empty();

        // Create the elements to store current weather info. Units will be converted if needed.

        let currentDate = moment().format('DD/MM/YYYY')
        let tempData = (response.main.temp - 273.15).toFixed(2);
        let windData = (response.wind.speed * 2.23694).toFixed(1);

        const todayTitle = $('<h2>').text(cityName + ' (' + currentDate + ')');
        const todayTemp = $('<p>').text('Temp: ' + tempData + '℃');
        const todayWind = $('<p>').text('Wind: ' + windData + ' KPH')
        const todayHumidity = $('<p>').text('Humidity: ' + response.main.humidity + '%');

        $('#today').append(todayTitle, todayTemp,todayWind, todayHumidity)
    })
}






$('#search-button').on('click', function(event){
    event.preventDefault();
    
    cityName = $('#search-input').val().trim();
    getGeoInfo();
    console.log(cityGeo);
    getCurrentWeather();
    
    
})