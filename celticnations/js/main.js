/* Leaflet Lab Example */

//Create the Leaflet map
function createMap(){

	var southWest = L.latLng(40, -20),
  	northEast = L.latLng(65, 15),
  	bounds = L.latLngBounds(southWest, northEast);

	//create the map
	var map = L.map('map', {
		center: [54.4, -4.8],
		zoom: 5,
		maxZoom: 11,
  	minZoom: 4,
  	// maxBounds: bounds,
    zoomControl: false 
    // layers: [Thunderforest_Outdoors, Esri_WorldImagery]
	});

  var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(map);

  // var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
  //   attribution: 'Map by <a href="http://cjmorgs.github.io">Christopher Morgan</a> | Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //   subdomains: 'abcd',
  //   minZoom: 1,
  //   maxZoom: 16,
  //   ext: 'png'
  // }).addTo(map);

  map.createPane('labels');
  map.getPane('labels').style.zIndex = 5;

  var Custom_Basemap = L.tileLayer('https://api.mapbox.com/styles/v1/cjmorgan3/ciwjpfxjg000l2qnx9psnbju9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2ptb3JnYW4zIiwiYSI6ImNpZnlmYTRhcjUydGtzeG0xYnN3Yzlob2kifQ.59R4wFBtWHUdtZR2TToiJA', {
    attribution: 'Map and Tiles by <a href="http://cjmorgs.github.io">Christopher Morgan</a> using <a href="https://www.mapbox.com/">Mapbox</a> | <a href="img/">Image Credit</a>',
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16
  }).addTo(map);

  var Custom_Basemap_Labels = L.tileLayer('https://api.mapbox.com/styles/v1/cjmorgan3/cj920tci531392rla1y4kmjea/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2ptb3JnYW4zIiwiYSI6ImNpZnlmYTRhcjUydGtzeG0xYnN3Yzlob2kifQ.59R4wFBtWHUdtZR2TToiJA', {
    subdomains: 'abcd',
    minZoom: 1,
    maxZoom: 16,
    pane: 'labels'
  }).addTo(map);

  // var Thunderforest_Landscape = L.tileLayer('https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=9eb13da72c0944449017d6c7b53fa579', {
  //   attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  //   }).addTo(map);

	//call getData function
	getData(map);

  // create sidebar
  var sidebar = L.control.sidebar('sidebar', {
      closeButton: true,
      position: 'left'
  });
    
  map.addControl(sidebar);
    setTimeout(function () 
    {sidebar.show();}, 500);

  sidebar.on('hidden', function () {
      window.sidebarinfo = L.easyButton({
        states: [{
          icon: 'fa-info',
          stateName: 'remove-info',
          onClick: function(control) {
            sidebar.show(); 500;
            control.state('add-info');
          },
          title: 'Expand informational sidebar'
        }],
      });
      sidebarinfo.addTo(map)
  });

  sidebar.on('shown', function() {
      sidebarinfo.removeFrom(map)
  });
};

  // new L.Control.GeoSearch({
  //   provider: new L.GeoSearch.Provider.Google()
  // }).addTo(map);


//Import GeoJSON data
function getData(map){

  $.getJSON("data/CelticNations.geojson",function(nationData){
    L.geoJson( nationData,{
      style: function(feature){
        var fillColor,
            name = feature.properties.Nation;
        if ( name == "Scotland" ) fillColor = "#0068b3";
        else if ( name == "Ireland" ) fillColor = "#009e60";
        else if ( name == "Isle of Man" ) fillColor = "#551a8b";
        else if ( name == "Wales" ) fillColor = "#ff0000";
        else if ( name == "Cornwall" ) fillColor = "#ff9933";
        else if ( name == "Brittany" ) fillColor = "#000000";
        else if ( name == "Galicia" ) fillColor = " #0099cb";
        else fillColor == "#f7f7f7";  // no data
        return { color: "#fff", weight: 2, opacity: .6, fillColor: fillColor, fillOpacity: .6 }; 

      },
      onEachFeature: function (feature, layer) {
                popupOptions = {maxWidth: 230, minWidth: 230, zIndex: 15};
                if ( feature.properties.ModCntry == "United Kingdom (Northern Ireland)" ) layer.bindPopup("<b id='nation'>" + feature.properties.Nation + "</b>" + "<br><b>Celtic Language:</b> " + feature.properties.CeltLang + "<br><b>Celtic Name:</b> " + feature.properties.CeltName +  "<br><b>Modern Sovereign Country:</b><br>" + feature.properties.ModCntry + " <img src=img/23px_UK.png>" + "<br><br><img width=100% src=img/Ireland.png>"
                    ,popupOptions);
                else if ( feature.properties.ModCntry == "United Kingdom (Isle of Man)" ) layer.bindPopup("<b id='nation'>" + feature.properties.Nation + "</b>" + "<br><b>Celtic Language:</b> " + feature.properties.CeltLang + "<br><b>Celtic Name:</b> " + feature.properties.CeltName +  "<br><b>Modern Sovereign Country:</b><br>" + feature.properties.ModCntry + " <img src=img/23px_UK.png>" + "<br><br><img width=100% src=img/Isle-of-Man.png>"
                    ,popupOptions);
                else if ( feature.properties.ModCntry == "Republic of Ireland" ) layer.bindPopup("<b id='nation'>" + feature.properties.Nation + "</b>" + "<br><b>Celtic Language:</b> " + feature.properties.CeltLang + "<br><b>Celtic Name:</b> " + feature.properties.CeltName +  "<br><b>Modern Sovereign Country:</b><br>" + feature.properties.ModCntry + " <img src=img/23px_ROI.png>" + "<br><br><img width=100% src=img/" + feature.properties.Nation + ".png>"
                    ,popupOptions);
                else if ( feature.properties.ModCntry == "France" ) layer.bindPopup("<b id='nation'>" + feature.properties.Nation + "</b>" + "<br><b>Celtic Language:</b> " + feature.properties.CeltLang + "<br><b>Celtic Name:</b> " + feature.properties.CeltName +  "<br><b>Modern Sovereign Country:</b> " + feature.properties.ModCntry + " <img src=img/23px_France.png>" + "<br><br><img width=100% src=img/" + feature.properties.Nation + ".png>"
                    ,popupOptions);
                else if ( feature.properties.ModCntry == "Spain" ) layer.bindPopup("<b id='nation'>" + feature.properties.Nation + "</b>" + "<br><b>Celtic Language:</b> " + feature.properties.CeltLang + "<br><b>Celtic Name:</b> " + feature.properties.CeltName +  "<br><b>Modern Sovereign Country:</b><br>" + feature.properties.ModCntry + " <img src=img/23px_Spain.png>" + "<br><br><img width=100% src=img/" + feature.properties.Nation + ".png>"
                    ,popupOptions);  
                else layer.bindPopup("<b id='nation'>" + feature.properties.Nation + "</b>" + "<br><b>Celtic Language:</b> " + feature.properties.CeltLang + "<br><b>Celtic Name:</b> " + feature.properties.CeltName +  "<br><b>Modern Sovereign Country:</b><br>" + feature.properties.ModCntry + " <img src=img/23px_UK.png>" + "<br><br><img width=100% src=img/" + feature.properties.Nation + ".png>"
                    ,popupOptions);
            }
    }).addTo(map);
  }); 

    // load GeoJSON from an external file
  $.getJSON("data/Cities.geojson",function(cityData){
    var cityIcon = L.icon({
      iconUrl: "img/citypin.png",
      iconSize: [25, 32],
      iconAnchor: [20, 30],
      popupAnchor: [-7.5, -18]
    });

    // add GeoJSON layer to the map once the file is loaded
    var cities = L.geoJson(cityData,{
      pointToLayer: function(feature,latlng){
        return L.marker(latlng,{icon: cityIcon});
      },
      onEachFeature: function (feature, layer) {
                popupOptions = {maxWidth: 150, minWidth: 150};
                if ( feature.properties.City == "Santiago de Compostela" ) layer.bindPopup("<b id='cityNpark'>" + feature.properties.City + "</b>" + "<br>" + "<b>Celtic Name:</b> " + feature.properties.Celtic_Name + "<br>" + "<b>Meaning:</b> " + feature.properties.Meaning + "<br>" + "<b>Nation:</b> " + feature.properties.Nation + "<br>" + "<b>Population:</b> " + feature.properties.Population + "<br>" + "<br>" + "<img width=100% src=img/cities/santiagodecompostela.png>"
                    ,popupOptions);
                else layer.bindPopup("<b id='cityNpark'>" + feature.properties.City + "</b>" + "<br>" + "<b>Celtic Name:</b> " + feature.properties.Celtic_Name + "<br>" + "<b>Meaning:</b> " + feature.properties.Meaning + "<br>" + "<b>Nation:</b> " + feature.properties.Nation + "<br>" + "<b>Population:</b> " + feature.properties.Population + "<br>" + "<br>" + "<img width=100% src=img/cities/" + feature.properties.City + ".png>"
                    ,popupOptions);
            }
    });

    var citymarkers = L.easyButton({
      states: [{
        icon: 'fa-users',
        stateName: 'add-markers',
        title: 'Add cities',
        onClick: function(control) {
          map.addLayer(cities);
          control.state('remove-markers');
        }
      }, {
        icon: 'fa-undo',
        stateName: 'remove-markers',
        onClick: function(control) {
          map.removeLayer(cities);
          control.state('add-markers');
        },
        title: 'Remove cities'
      }]
    });
    citymarkers.addTo(map);
  });

      // load GeoJSON from an external file
  $.getJSON("data/Parks.geojson",function(parkData){
    var parkIcon = L.icon({
      iconUrl: "img/parkpin.png",
      iconSize: [25, 32],
      iconAnchor: [20, 30],
      popupAnchor: [-7.5, -18]
    });

    // add GeoJSON layer to the map once the file is loaded
    var parks = L.geoJson(parkData,{
      pointToLayer: function(feature,latlng){
        return L.marker(latlng,{icon: parkIcon});
      },
      onEachFeature: function (feature, layer) {
                popupOptions = {maxWidth: 150, minWidth: 150};
                layer.bindPopup("<b id='cityNpark'>" + feature.properties.Park + "</b>" + "<br>" + "<b>Nation:</b> " + feature.properties.Nation + "<br>" + "<br>" + "<img width=100% src=img/parks/" + feature.properties.Park.substr(0,feature.properties.Park.indexOf(' ')) + ".png>"
                    ,popupOptions);
            }
    });

    var parkmarkers = L.easyButton({
      states: [{
        icon: 'fa-tree',
        stateName: 'add-markers',
        title: 'Add parks',
        onClick: function(control) {
          map.addLayer(parks);
          control.state('remove-markers');
        }
      }, {
        icon: 'fa-undo',
        stateName: 'remove-markers',
        onClick: function(control) {
          map.removeLayer(parks);
          control.state('add-markers');
        },
        title: 'Remove parks'
      }]
    });
    parkmarkers.addTo(map);
  });

};


$(document).ready(createMap);