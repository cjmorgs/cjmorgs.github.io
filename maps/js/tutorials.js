// Creates variable and sets it equal to a map that was just created in the given div. Also sets default extent and zoom level
var tutorialmap = L.map('tutorialmap').setView([51.505, -0.1], 12);

//adds tile layer from web and sets parameters, adding it to the map
var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(tutorialmap);

//creates a marker, sets it coordinates, and adds it to the map
var marker = L.marker([51.5, -0.09]).addTo(tutorialmap);

//creates a circle, sets its parameters, and adds it to the map
var circle = L.circle([51.508, -0.11], 500, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
}).addTo(tutorialmap);

//creates a polygon, sets its corners, and adds it to the map
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(tutorialmap);

//creates popups and corresponding messages for the previously created symbols
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//creates a standalone popup, sets its coordinates and message, and adds it to the map
var popup = L.popup()
    .setLatLng([51.48844, -0.11673])
    .setContent("I am a standalone popup.")
    .openOn(tutorialmap);

//creates a map click function that returns the coordinates of wherever the user clicks, adds it to the map in the form of a popup
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(tutorialmap);
}

//own addition using GeoJSON
//creates geoJson features and their properties
 var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Buckingham Palace",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-0.142302, 51.501112]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "The British Museum",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [ -0.127106, 51.520348]
    }
}];

//takes the newly created features and only adds the ones marked with 'true' in their properties to the map
L.geoJson(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(tutorialmap);

//calls the onMapClick function
tutorialmap.on('click', onMapClick);