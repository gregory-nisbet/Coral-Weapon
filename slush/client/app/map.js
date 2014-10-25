var rendererOptions = {
  draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();
var elevator;
var map;
var chart;
var polyline;
var currentPosition;
//assign defalut position
var currentLatitude = 37.783478;
var currentLongitude = -122.409093;
var path;
var content;

// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['columnchart']});

var savePath = function(){
  console.log('saved the path! ' + path);
};

var setupMap = function(content){
  currentPosition = new google.maps.LatLng( currentLatitude, currentLongitude );

  var options = {
    map: map,
    position: currentPosition
  };

  if (content != undefined){
    options.content = content;
    var infowindow = new google.maps.InfoWindow(options);
  }

  map.setCenter(currentPosition);
  directionsDisplay.setMap(map);
  //directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    var res = directionsDisplay.getDirections();
    computeTotalDistance(res);
    path = res.routes[0].overview_path;
    drawChart(res);
  });
  elevator = new google.maps.ElevationService();
  calcRoute();
};

var calcDifficulty = function(elevations){
  var difficulty = 0;
  for(var i = 0; i < elevations.length - 1; i++){
    //calculate the elevation change
    var ele = elevations[i+1].elevation - elevations[i].elevation;
    // calculate the distance
    var disB = elevations[i+1].location.B - elevations[i].location.B;
    var disK = elevations[i+1].location.k - elevations[i].location.k;
    if(disB < 0){ disB *= -1; }
    if(disK < 0){ disK *= -1; }
    var dis = Math.sqrt( Math.pow( disB, 2 ) + Math.pow( disK, 2 ) );
    //devide elevation by distance (if it is a uphill, maltiple by 2)
    var dif = ele/dis;
    dif = (dif > 0) ? dif * 2 : dif * -1;
    difficulty += dif;
  };
  difficulty =Math.round(difficulty / 1000) / 100;

  $('.difficulty').html('level ' + difficulty);
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
      content = 'Error: The Geolocation service failed.';
      setupMap(content);
    });

  }else{
    // Browser doesn't support Geolocation
    content = 'Error: Your browser doesn\'t support geolocation.';
    setupMap(content);
  }
};

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

  //culculate the dificulty
  calcDifficulty(elevations);
};

var getRequest = function(currentPo, destPo, wayPtArr){
  var request = {
    origin: currentPo,
    destination: destPo,
    waypoints: wayPtArr,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.WALKING,
    avoidHighways: true,
    avoidTolls: true
  }

  return request; 
}

var calcRoute = function() {
  var destination = new google.maps.LatLng(currentLatitude, currentLongitude+0.02);
  var request = getRequest(currentPosition, destination);
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      drawChart(response);
    }
  });
};

function drawChart(response) {

  // Create a new chart in the elevation_chart DIV.
  chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));

  //console.log(response);

  var path = response.routes[0].overview_path;

  // Create a PathElevationRequest object using this array.
  // Ask for 256 samples along that path.
  var pathRequest = {
    'path': path,
    'samples': 256
  }

  // Initiate the path request.
  elevator.getElevationAlongPath(pathRequest, plotElevation);
}

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
$(document).ready(function(){
  $('.navbar-nav').on('click', 'li', function(){
    $('.navbar-nav').children().removeClass('active');
    $(this).addClass('active');
  });
});