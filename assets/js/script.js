
// // Declaration of global variables
let cityName = '';

// Function to build the URL for the geocoding API
function buildGeoURL(cityName) {
    let geocodingURL = 'http://api.openweathermap.org/geo/1.0/direct?';
    let geocodingParams = {'appid': '6d15a98c4f1e6bf4dce53c48165b4e99'};
    geocodingParams.q = cityName;
    geocodingURL += $.param(geocodingParams);
    return geocodingURL;
}


// Function to get current weather and display it on the webpage
function getCurrentWeather(geoData) {
    // Build the queryURL based on the lon and lat data 
    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?';
    let queryParams = {
    'appid': '6d15a98c4f1e6bf4dce53c48165b4e99'
    }
    queryParams.lat = geoData[0].lat;
    queryParams.lon = geoData[0].lon;
    queryURL += $.param(queryParams);
    
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .then(function(response){
        // console.log(response);
        //Empty the previous weather data
        $('#today').empty();

        // Create the elements to store current weather info. Units will be converted if needed.

        let currentDate = moment().format('DD/MM/YYYY')
        let tempData = (response.main.temp - 273.15).toFixed(2);
        let windData = (response.wind.speed * 2.23694).toFixed(1);
        let weatherIconId = response.weather[0].icon;
        let iconURL = 'http://openweathermap.org/img/wn/'+ weatherIconId + '@2x.png';

        const todayTitle = $('<h2>').text(geoData[0].name + ' (' + currentDate + ')');
        const iconEl = $("<img>").attr('src', iconURL);
        const todayTemp = $('<p>').text('Temp: ' + tempData + '℃');
        const todayWind = $('<p>').text('Wind: ' + windData + ' KPH')
        const todayHumidity = $('<p>').text('Humidity: ' + response.main.humidity + '%');

        todayTitle.append(iconEl);
        $('#today').append(todayTitle, todayTemp,todayWind, todayHumidity)
        $('#today').addClass('border border-dark p-1');
    })
}


// Function to get weather forecast for a city and display on the webpage
function getForecastWeather(geoData) {
    // Build the queryURL based on the lon and lat data 
    let queryURL = 'http://api.openweathermap.org/data/2.5/forecast?';
    let queryParams = {
    'appid': '6d15a98c4f1e6bf4dce53c48165b4e99'
    }
    queryParams.lat = geoData[0].lat;
    queryParams.lon = geoData[0].lon;
    queryURL += $.param(queryParams);
    // console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .then(function(response){

        // console.log(response);

        $('#forecast').empty();
        // Delcaration variables to store the current date and current hour slot by 3-hour period
        
        let currentHour = moment().format('HH');
        let hourSlot = Math.floor(currentHour/3);
        
        const forecastTitleEl = $('<h2>').text('5-day Forecast:').attr('class', 'col-12', 'mt-3');
        $('#forecast').append(forecastTitleEl);

        // Use 'For loop' to create elements and show the forecasts to the webpage
        for(let i = 0; i < 5; i++) {
            let slotNumber = hourSlot + i * 8;

            // console.log('The loop is working now');
            // Declaration of variables to store weather data
            let tempData = (response.list[slotNumber].main.temp -273.15).toFixed(2);
            let windData = (response.list[slotNumber].wind.speed * 2.23694).toFixed(1);
            let weatherIconId = response.list[slotNumber].weather[0].icon;
            let iconURL = 'http://openweathermap.org/img/wn/'+ weatherIconId + '@2x.png'
            // console.log(tempData + "   " + windData);
            // console.log(iconURL);

            let showDate = moment().add('days', i+1).format('DD/MM/YYYY');
            // console.log(showDate);
            const cardDiv = $('<div>').addClass('card col-2 bg-info');
            const showDateEl= $('<h5>').text(showDate);
            const iconEl = $('<img>').attr('src', iconURL);
            const tempDataEl = $('<p>').text('Temp: ' + tempData + '℃');
            const windDataEl = $('<p>').text('Wind: ' + windData + ' KPH');
            const humidityEl = $('<p>').text('Humidity: ' + response.list[slotNumber].main.humidity + ' %')
            
            cardDiv.append(showDateEl, iconEl, tempDataEl, windDataEl, humidityEl);
            $('#forecast').append(cardDiv);
        }
    })
}

// function to record the search history
function recordSearch(geoData) {
    console.log('This is the function to record the search history.');
    let cityArr = JSON.parse(localStorage.getItem('cityHistory'));
    if (cityArr === null) {
        cityArr = [];
        cityArr.unshift(geoData[0].name);
        localStorage.setItem('cityHistory', JSON.stringify(cityArr));
        console.log('No search history.');
        const historyEl = $('<button>').text(geoData[0].name);
        historyEl.attr({type: 'button', class: 'btn btn-secondary btn-lg btn-block'});
        $('#history').prepend(historyEl);
        
    } else if (cityArr.includes(geoData[0].name)) {
        console.log(('This city is in the search history'));
    } else {
        console.log(('This is a new city'));
        cityArr.unshift(geoData[0].name);
        localStorage.setItem('cityHistory', JSON.stringify(cityArr));
        const historyEl = $('<button>').text(geoData[0].name);
        historyEl.attr({type: 'button', class: 'btn btn-secondary btn-lg btn-block'});
        $('#history').prepend(historyEl);
    }
}

// function to reset the start page
function resetPage() {
    console.log('This is the reset page function');
    // empty the current and forecast weather info
    $('#today').empty();
    $('#forecast').empty();

    let cityArr = JSON.parse(localStorage.getItem('cityHistory'));
    console.log(cityArr);
    if (cityArr != null) {
        console.log('City array is not empty');
        cityArr.forEach(cityName => {
            const historyEl = $('<button>').text(cityName);
            historyEl.attr({type: 'button', class: 'btn btn-secondary btn-lg btn-block'});
            $('#history').prepend(historyEl);
        })
    }
}


$(document).ready( function(){
    // When the page is loaded, remove the weather information, and display the previous search results.
    resetPage();

    // Add event listener to the search button
    $('#search-button').on('click', function(event){
        // Prevent the refresh when hit the 'submit' button.
        event.preventDefault();
        // store the city name into the ''.cityName
        cityName = $('#search-input').val().trim();

        // get the queryURL for the target city
        let queryGeoURL = buildGeoURL(cityName);
        // console.log(queryGeoURL);
        
        // run the functions with .then() to display the current, forecast weather and create search buttons
        $.ajax({
            url: queryGeoURL,
            method: 'GET'
        })
        .then(function (geoData) {
            getCurrentWeather(geoData);
            getForecastWeather(geoData);
            recordSearch(geoData);
        })
    })
    // Add event listener to the history buttons.
    $('#history').on('click', 'button', function(event){
        event.preventDefault();
        console.log(event.target.innerText);
        cityName = event.target.innerText.trim();
        let queryGeoURL = buildGeoURL(cityName);

        $.ajax({
            url: queryGeoURL,
            method: 'GET'
        })
        .then(function(geoData){
            getCurrentWeather(geoData);
            getForecastWeather(geoData);
        })
    })
})
