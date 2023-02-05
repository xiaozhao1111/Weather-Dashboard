// Get the geographical coordinates information based on the city name in the input-form 
function getGeoInfo(cityName) {
    // Build the queryURL from the input-form
    let geocodingURL = 'http://api.openweathermap.org/geo/1.0/direct?';
    let geocodingParams = {'appid': '6d15a98c4f1e6bf4dce53c48165b4e99'};
    geocodingParams.q = cityName;
    // console.log the URL
    console.log(geocodingURL + $.param(geocodingParams));
    geocodingURL += $.param(geocodingParams);

    // Make the AJAX request to the Geocoding API, and get the JSON data
    $.ajax({
        url: geocodingURL,
        methond: 'GET',
    }).then(function(response){
        console.log(response.name);
        const cityGeo = {
            lon: response[0].lon,
            lat: response[0].lat
        }
        console.log(cityGeo);
        return cityGeo;
    })
}


$('#search-button').on('click', function(event){
    event.preventDefault();
    console.log('The button was clicked!');
    let cityName = $('#search-input').val().trim();
    getGeoInfo(cityName);
})