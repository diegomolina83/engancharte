let arrLocationsApi = []


axios.get('http://localhost:3000/works/api')
    .then(res =>{ 
        arrLocationsApi = res.data
        console.log(arrLocationsApi)

    }).then( res => {
        console.log('OTRO ARRAY: --->', arrLocationsApi[4].location)

        
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?components=route:\
            Annankatu|administrative_area:${arrLocationsApi[4].location}|country:España&key=AIzaSyDZzm0DI7JwThVwysdtDJkdsFCktalySFc`)
        .then(res => {console.log(res.data.results[0].geometry.location)
        })
})

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 6,
      center: { lat: 40.416775, lng: -3.703790 }
    });
    const geocoder = new google.maps.Geocoder();
    document.getElementById("submit").addEventListener("click", () => {
      geocodeAddress(geocoder, map);
    });
  }   // DEBE SER REVERSE GEOCODING
  
  function geocodeAddress(geocoder, resultsMap) {
    const address = document.getElementById("address").value;
    geocoder.geocode({ address: address + ', España' }, (results, status) => {
      if (status === "OK") {
          console.log('LOCATION--->', results[0].geometry.location)
        resultsMap.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }