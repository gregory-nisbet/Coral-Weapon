var rendererOptions = { draggable: true };
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
var res;

// Load the Visualization API and the columnchart package.
google.load('visualization', '1', {packages: ['columnchart']});

//=================FUNCTIONS TO USE WHEN INITIALIZE=======================

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
  elevator = new google.maps.ElevationService();
  calcRoute();
  
  //add listner for the route change
  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    res = directionsDisplay.getDirections();
    path = res.routes[0].overview_path;
    computeTotalDistance(res);
    drawChart(res);
  });
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
};

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

// ====================TO DISPLAY INFO DIV==========================

var computeTotalDistance = function(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.0;
  $('#total').html(total);
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

  $('.difficulty').html(difficulty);
};

function drawChart(response) {
  // Create a new chart in the elevation_chart DIV.
  chart = new google.visualization.ColumnChart(document.getElementById('elevation_chart'));

  // Create a PathElevationRequest object using this array.
  // Ask for 256 samples along that path.
  var pathRequest = {
    'path': path,
    'samples': 256
  }

  // Initiate the path request.
  elevator.getElevationAlongPath(pathRequest, plotElevation);
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

// =======================TO SHOW THE SAVED ROUTES=============================

var loadMap = function(runningRoute){
  var rr = fix(runningRoute);
  directionsDisplay.setDirections(rr);
};

//fixes the saved route object when user clicks on the saved route
var fix = function(obj){
  var bounds = obj.routes[0].bounds;
  var sw = new google.maps.LatLng(parseFloat(bounds.Ea.j), parseFloat(bounds.va.j));
  var ne = new google.maps.LatLng(parseFloat(bounds.Ea.k), parseFloat(bounds.va.k));
  obj.routes[0].bounds = new google.maps.LatLngBounds(sw, ne);
  var legs = obj.routes[0].legs;
  for(var kk = 0; kk < legs.length; kk++){
    var steps = obj.routes[0].legs[kk].steps;
    var waypoint = legs[kk].via_waypoint;
    var waypoints = legs[kk].via_waypoints;
    for(var j = 0; j < waypoints.length; j++){
      waypoint[j].location = new google.maps.LatLng(parseFloat(waypoint[j].location.k), parseFloat(waypoint[j].location.B));
      waypoint[j].location = new google.maps.LatLng(parseFloat(waypoint[j].location.k), parseFloat(waypoint[j].location.B));
      waypoints[j] = new google.maps.LatLng(parseFloat(waypoints[j].k), parseFloat(waypoints[j].B));
      waypoints[j] = new google.maps.LatLng(parseFloat(waypoints[j].k), parseFloat(waypoints[j].B));

    }
    for(var j = 0; j < steps.length; j++){
      var path = steps[j].path;
      var lat_lngs = steps[j].lat_lngs;
      for(var i = 0; i < path.length; i++){
          path[i] = new google.maps.LatLng(parseFloat(path[i].k), parseFloat(path[i].B));
          lat_lngs[i] = new google.maps.LatLng(parseFloat(lat_lngs[i].k), parseFloat(lat_lngs[i].B));
      }
    }
    legs[kk].start_location = new google.maps.LatLng(parseFloat(legs[kk].start_location.k), parseFloat(legs[kk].start_location.B));
    legs[kk].end_location = new google.maps.LatLng(parseFloat(legs[kk].end_location.k), parseFloat(legs[kk].end_location.B));
  }
  var op = obj.routes[0].overview_path;
  for(var i = 0; i < op.length; i++){
    op[i] = new google.maps.LatLng(parseFloat(op[i].k), parseFloat(op[i].B));
  }
  return obj;
};

// ===========TO INITIALIZE WHEN THE WINDOW IS LOADED===============

google.maps.event.addDomListener(window, 'load', initialize);

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

// ============TO SHOW THE ACTIVE BUTTON IN NAV BAR ===================

$(document).ready(function(){
  //add savedRoute link active class when loaded 
  $('.navbar-nav li:nth-child(2)').addClass('active');
  //toggle active class in navbar, when one of the buttons are clicked. 
  $('.navbar-nav').on('click', 'li', function(){
    $('.navbar-nav').children().removeClass('active');
    $(this).addClass('active');
  });
});

