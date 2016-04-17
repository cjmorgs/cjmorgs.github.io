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
    getData(map);
    getDataLang(map);
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = .005;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];

    //create marker options
    var options = {
        fillColor: "#33cc33",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

   //original popupContent changed to panelContent...Example 2.2 line 1
    var panelContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

    //add formatted attribute to panel content string
    var year = attribute.split("_")[1];
    panelContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + "</p>";

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
            $("#suppinfo").html(panelContent);
        }
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;
            
            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
        };
    });

    //update sequence legend
    //updateLegend(map, attribute);
};

//Create new sequence controls
function createSequenceControls(map, attributes){
    //create range input element (slider)
    $('#slider').append('<input class="range-slider" type="range">');
    //set slider attributes
    $('.range-slider').attr({
        max: 6,
        min: 0,
        value: 0,
        step: 1
    });
    //Add skip buttons
    $('#slider').append('<button class="skip" id="reverse">Reverse</button>');
    $('#slider').append('<button class="skip" id="forward">Skip</button>');
    $('#reverse').html('<img src="img/leftarrow.png">');
    $('#forward').html('<img src="img/rightarrow.png">');

    //click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //increment or decriment depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //if past the first attribute, wrap around to last attribute
            index = index < 0 ? 6 : index;
        };

        //update slider
        $('.range-slider').val(index);

        //pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });

    //input listener for slider
    $('.range-slider').on('input', function(){
        //get the new index value
        var index = $(this).val();

        //pass new attribute to update symbols
        updatePropSymbols(map, attributes[index]);
    });
};

function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')

            //start attribute legend svg string
            var svg = '<svg id="attribute-legend" width="160px" height="60px">';

            //object to base loop on
            var circles = {
                max: 20,
                mean: 40,
                min: 60
            };

            //loop to add each circle and text to svg string
            for (var circle in circles){
                //circle string
                svg += '<circle class="legend-circle" id="' + circle + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="30"/>';

                //text string
                svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
            };

            //close svg string
            svg += "</svg>";

            //add attribute legend svg to container
            $(container).append(svg);

            return container;
        }
    });

    map.addControl(new LegendControl());
};

//build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);
        };
    };

    return attributes;
};

//Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/celticcities.geojson", {
        dataType: "json",
        success: function(response){
            //create an attributes array
            var attributes = processData(response);
            //call function to create proportional symbols, then sequence controls
            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
        }
    });
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

