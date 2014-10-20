var rendererOptions = {
  draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
var directionsService = new google.maps.DirectionsService();
var elevator;
var map;
var chart;
var polyline;
var currentPosition;
//assign defalut position
var currentLatitude = 37.783478;
var currentLongitude = -122.409093;

// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['columnchart']});

var setupMap = function(){
  currentPosition = new google.maps.LatLng( currentLatitude, currentLongitude );
  var infowindow = new google.maps.InfoWindow({
    map: map,
    position: currentPosition,
  });
  map.setCenter(currentPosition);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    console.log(directionsDisplay.getDirections());
    computeTotalDistance(directionsDisplay.getDirections());
  });
};

function initialize() {
  var mapOptions = {
    zoom: 15
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currentLatitude = position.coords.latitude;
      currentLongitude = position.coords.longitude;
      setupMap();

      // Create an ElevationService.
      //elevator = new google.maps.ElevationService();

      //updateElevator();

      calcRoute();
    }, function() {
      //if getting geolocation info failed.
      handleNoGeolocation();
    });

  }else{
    // Browser doesn't support Geolocation
    setupMap();
    calcRoute();
  }
}

function updateElevator() {

  // Create a new chart in the elevation_chart DIV.
  chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));

  // Change line of code below to get path from request
  //var path = [ whitney, lonepine, owenslake, panamintsprings, beattyjunction, badwater];


  // Create a PathElevationRequest object using this array.
  // var pathRequest = {
  //   'path': path,
  //   'samples': 100
  // }

  // Initiate the path request.
  //elevator.getElevationAlongPath(pathRequest, plotElevation);
}

// Takes an array of ElevationResult objects
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation(results, status) {
  if (status != google.maps.ElevationStatus.OK) {
    return;
  }
  var elevations = results;

  // Extract the elevation samples from the returned results
  // and store them in an array of LatLngs.
  var elevationPath = [];
  for (var i = 0; i < results.length; i++) {
    elevationPath.push(elevations[i].location);
  }

  // // Display a polyline of the elevation path.
  // var pathOptions = {
  //   path: elevationPath,
  //   strokeColor: '#0000CC',
  //   opacity: 0.4,
  //   map: map
  // }
  // polyline = new google.maps.Polyline(pathOptions);

  // Extract the data from which to populate the chart.
  // Because the samples are equidistant, the 'Sample'
  // column here does double duty as distance along the
  // X axis.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Sample');
  data.addColumn('number', 'Elevation');
  for (var i = 0; i < results.length; i++) {
    data.addRow(['', elevations[i].elevation]);
  }

  // Draw the chart using the data within its DIV.
  document.getElementById('elevation_chart').style.display = 'block';
  chart.draw(data, {
    height: 150,
    legend: 'none',
    titleY: 'Elevation (m)'
  });
}

function handleNoGeolocation() {
  var content = 'Error: The Geolocation service failed.';
  
  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

function calcRoute() {

  var request = {
    origin: currentPosition,
    destination: new google.maps.LatLng(currentLatitude, currentLongitude + 0.02),
    //waypoints:[{location: 'Bourke, NSW'}, {location: 'Broken Hill, NSW'}],
    travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(response, status) {
    console.log(response);
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.0;
  document.getElementById('total').innerHTML = total + ' km';
}

google.maps.event.addDomListener(window, 'load', initialize);
