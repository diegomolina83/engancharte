let locationCity
let LocationGeo
const galleryApp = new WorksApiHandler()

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 5.1,
        center: { lat: 40.416775, lng: -3.703790 },
        // styles: mapStyles.aubergine

    });

    const parameters = window.location.pathname.split("/");
    const id = parameters[parameters.length - 1]
    galleryApp.getLocation(id)
        .then(res => {

            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${res.data.location}&region=es&key=AIzaSyDZzm0DI7JwThVwysdtDJkdsFCktalySFc`)
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
        })
}
