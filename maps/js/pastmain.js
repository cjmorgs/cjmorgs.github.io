//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [52.908902, -4.493652],
        zoom: 5
    });

var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    ext: 'png'
}).addTo(map);

    //call getData function
    getDataLang(map);
};

//calculate the radius of each proportional symbol
function calcPropRadiusLang(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = .005;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//function to convert markers to circle markers
function pointToLayerLang(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "Celtic";

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadiusLang(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

   //original popupContent changed to panelContent...Example 2.2 line 1
    var panelContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

    //add formatted attribute to panel content string
    var year = attribute.split("_")[1];
    panelContent += "<p><b>Celtic Language Speakers Today" + ":</b> " + feature.properties[attribute] + "</p>";

    //popup content is now just the city name
    var popupContent = feature.properties.City;

    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius),
        closeButton: false
    });

    //event listeners to open popup on hover and fill panel on click
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        },
        click: function(){
            $("#panel").html(panelContent);
        }
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbolsLang(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayerLang(feature, latlng);
        }
    }).addTo(map);
};

//Import GeoJSON data
function getDataLang(map){
    //load the data
    $.ajax("data/celticlanguages.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols, then sequence controls
            createPropSymbolsLang(response, map);
        }
    });
};

$(document).ready(createMap);
