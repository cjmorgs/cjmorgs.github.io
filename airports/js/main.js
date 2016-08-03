/* Leaflet Lab Example */

//Create the Leaflet map
function createMap(){

	var southWest = L.latLng(43.179677, -98.745729),
  	northEast = L.latLng(49.808330, -89.385378),
  	bounds = L.latLngBounds(southWest, northEast);

	//create the map
	var map = L.map('map', {
		center: [46.481, -93.8],
		zoom: 7,
		maxZoom: 17,
  	minZoom: 6,
  	maxBounds: bounds
    // layers: [Thunderforest_Outdoors, Esri_WorldImagery]
	});

  var MapboxOutdoors = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW5kb3RhZXJvIiwiYSI6ImNpcWxieXVxazAwMTRmb25ucGphc2ZwdjMifQ.L1HkZQ-b4CtjtJZOWZer3A').addTo(map);
  // https: also suppported.
  // var Thunderforest_Outdoors = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  // }).addTo(map);
  // var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
  //   {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  // }).addTo(map);

  // var baseMaps = {
  //   "Map": Thunderforest_Outdoors,
  //   "Satellite": Esri_WorldImagery
  // };

  // L.control.layers(baseMaps).addTo(map);

	//call getData function
	getData(map);
};

  // var zoomHome = L.Control.zoomHome(); 
  // zoomHome.addTo(map); 

  // new L.Control.GeoSearch({
  //   provider: new L.GeoSearch.Provider.Google()
  // }).addTo(map);
  

//Import GeoJSON data
function getData(map){

  // load GeoJSON from an external file
  $.getJSON("data/CommercialAirports.geojson",function(data){
    var planeIcon = L.icon({
    iconUrl: 'img/airplane-red.png',
    iconSize: [30,27]
  });
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{
      pointToLayer: function(feature,latlng){
        return L.marker(latlng,{icon: planeIcon});
      }
    }).addTo(map);
  });

    // load GeoJSON from an external file
  $.getJSON("data/PavedAirports.geojson",function(data){
    var planeIcon = L.icon({
    iconUrl: 'img/airplane-orange.png',
    iconSize: [20,18]
  });
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{
      pointToLayer: function(feature,latlng){
        return L.marker(latlng,{icon: planeIcon});
      }
    }).addTo(map);
  });

    // load GeoJSON from an external file
  $.getJSON("data/PavedWithSeaplaneBaseAirports.geojson",function(data){
    var planeIcon = L.icon({
    iconUrl: 'img/airplane-anchor.png',
    iconSize: [30,22]
  });
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{
      pointToLayer: function(feature,latlng){
        return L.marker(latlng,{icon: planeIcon});
      }
    }).addTo(map);
  });

    // load GeoJSON from an external file
  $.getJSON("data/SeaplaneBaseAirports.geojson",function(data){
    var planeIcon = L.icon({
    iconUrl: 'img/anchor-new.png',
    iconSize: [14,16]
  });
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{
      pointToLayer: function(feature,latlng){
        return L.marker(latlng,{icon: planeIcon});
      }
    }).addTo(map);
  });

    // load GeoJSON from an external file
  $.getJSON("data/TurfAirports.geojson",function(data){
    var planeIcon = L.icon({
    iconUrl: 'img/airplane-green.png',
    iconSize: [15,13]
  });
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{
      pointToLayer: function(feature,latlng){
        return L.marker(latlng,{icon: planeIcon});
      }
    }).addTo(map);
  });

    // load GeoJSON from an external file
  $.getJSON("data/LightedTurfAirports.geojson",function(data){
    var planeIcon = L.icon({
    iconUrl: 'img/airplane-yellow.png',
    iconSize: [15,13]
  });
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{
      pointToLayer: function(feature,latlng){
        return L.marker(latlng,{icon: planeIcon});
      }
    }).addTo(map);
  });

};


$(document).ready(createMap);