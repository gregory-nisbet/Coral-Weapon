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

var setupMap = function(content){
  console.log("Begin setupMap");
  currentPosition = new google.maps.LatLng( currentLatitude, currentLongitude );

  var options = {
    map: map,
    position: currentPosition
  };

  if (content != undefined){
    options.content = content;
  }
  var infowindow = new google.maps.InfoWindow(options);

  map.setCenter(currentPosition);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    var res = directionsDisplay.getDirections();
    computeTotalDistance(res);
  });
  calcRoute();
  console.log("End setupMap");
};

var initialize = function() {

  map = new google.maps.Map(document.getElementById('map-canvas'));

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      currentLatitude = position.coords.latitude;
      currentLongitude = position.coords.longitude;
      setupMap();
    }, function() {
      //if getting geolocation info failed.
      var content = 'Error: The Geolocation service failed.';
      setupMap(content);
    });

  }else{
    // Browser doesn't support Geolocation
    setupMap();
  }
};

// var updateElevator = function() {
//
//   // Create a new chart in the elevation_chart DIV.
//   chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));
//
//   // Change line of code below to get path from request
//   //var path = [ whitney, lonepine, owenslake, panamintsprings, beattyjunction, badwater];
//
//
//   // Create a PathElevationRequest object using this array.
//   // var pathRequest = {
//   //   'path': path,
//   //   'samples': 100
//   // }
//
//   // Initiate the path request.
//   //elevator.getElevationAlongPath(pathRequest, plotElevation);
// };

// Takes an array of ElevationResult objects
// and plots the elevation profile on a Visualization API ColumnChart.
var plotElevation = function(results, status) {
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
};


var calcRoute = function() {

  var request = {
    origin: currentPosition,
    destination: new google.maps.LatLng(currentLatitude, currentLongitude + 0.02),
    //waypoints:[{location: 'Bourke, NSW'}, {location: 'Broken Hill, NSW'}],
    travelMode: google.maps.TravelMode.WALKING
  };
  directionsService.route(request, function(response, status) {
    //console.log('response', response);
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
    //console.log("End calcRoute-if");
  });
};

var computeTotalDistance = function(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.0;
  document.getElementById('total').innerHTML = total + ' km';
};

google.maps.event.addDomListener(window, 'load', initialize);
