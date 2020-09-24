let LocationGeo

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 5.1,
      center: { lat: 40.416775, lng: -3.703790 },
      styles: mapStyles.aubergine

});


const location = document.querySelector('#location').innerText
console.log(location)





axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=Madrid&region=es&key=AIzaSyDZzm0DI7JwThVwysdtDJkdsFCktalySFc`)
    .then(res => {
    objLocationGeo = {  
        lat: res.data.results[0].geometry.location.lat,
        lng: res.data.results[0].geometry.location.lng
    }

    const marker = new window.google.maps.Marker({
    position: objLocationGeo,
    map: map,
    })      
}) 
}
