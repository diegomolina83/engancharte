function moveMapToBerlin(map){
    map.setCenter({lat: 40.4165, lng: -3.70256});
    map.setZoom(6);
  }

  /**
   * Boilerplate map initialization code starts below:
   */


  
  //Step 1: initialize communication with the platform
  // In your own code, replace variable window.apikey with your own apikey
  var platform = new H.service.Platform({
    apikey: window.apikey
  });
  var defaultLayers = platform.createDefaultLayers();
  
  //Step 2: initialize a map - this map is centered over Europe
  var map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map,{
    zoom: 4,
    pixelRatio: window.devicePixelRatio || 1
  });



  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  
  //Step 3: make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
  
function modify() {
   // evt.preventDefault()
    const location = document.querySelector('#location')
    axios.get('http://localhost:3000/maps').then((res, ) => console.log(res.data))  // Peticion 
}

const location2 = document.querySelector('#button')
location2.addEventListener('click', modify, false)




  const service = platform.getSearchService()

function getGeocode(map) {
    service.geocode({
        q: 'Madrid Majadahonda'
      }, (result) => {
          // Add a marker for each location found
          result.items.forEach((item) => {
            map.addObject(new H.map.Marker(item.position));
          });
        }, alert);  
    }

  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);
  
  // Now use the map as required...
  window.onload = function () {
    moveMapToBerlin(map);
    getGeocode(map)
    modify()
  }