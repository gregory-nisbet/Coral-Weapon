angular.module('shortly.newRoute', [])
.controller('NewRouteController', function ($scope, $location, RunningRoutes) {

  $scope.runningRoute = {};

  $scope.addRunningRoute = function () {
    $scope.loading = true;
    $scope.runningRoute.runningRoute = res;
    $scope.runningRoute.rating = 0;
    //console.log("$scope.runningRoute", $scope.runningRoute);
    RunningRoutes.addRunningRoute($scope.runningRoute)
      .then(function () {
        $scope.loading = false;
        $location.path('/savedRoutes');
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  $scope.generateRoute = function(){
    //console.log('generating route!');
    genLoop();
  };

  // $scope.saveRoute = function () {
  //   var savedRoute = {label: $scope.label, isDone: false};
  //   $scope.savedRoutes.push(savedRoute);
  //   $window.localStorage.setItem('savedRoutes', JSON.stringify(angular.copy($scope.savedRoutes)));
  //   $scope.label = '';
  // };

  var getRandomDest = function(){
    var random = Math.random() / 100;
    var randomDest = 0;
    if(random < 0.05){
      randomDest = random;
    } else {
      randomDest = 0.05;
    }
    return randomDest;
  };

// var getRequest = function(currentPo, destPo, wayPtArr){
//   var request = {
//     origin: currentPo,
//     destination: destPo,
//     waypoints: wayPtArr,
//     optimizeWaypoints: true,
//     travelMode: google.maps.TravelMode.WALKING,
//     avoidHighways: true,
//     avoidTolls: true
//   }
//
//   return request;
// };

  var genLoop = function(){
    //console.log("I'm a function!");
    var wayPtArr = [];
    var randomDest = getRandomDest();
    var pt1 = new google.maps.LatLng(currentLatitude, currentLongitude+randomDest);
    var pt2 = new google.maps.LatLng(pt1.k, pt1.B+0.001);
    var pt3 = new google.maps.LatLng(pt2.k-0.002, pt2.B-0.005);
    // wayPtArr.push({
    //   location: pt1,
    //   stopover: false
    // }, {
    //   location: pt2,
    //   stopover: false
    // },{
    //   location: pt3,
    //   stopover: false
    // })
    wayPtArr.push({
      location: pt1,
      stopover: false
    });
    wayPtArr.push({
      location: pt2,
      stopover: false
    });
    wayPtArr.push({
      location: pt3,
      stopover: false
    });
    var request = getRequest(currentPosition, currentPosition, wayPtArr);
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        drawChart(response);
        res = response;
        //res.body.runningRoute.mc.j = 1;
        //res.body.runningRoute.mc.k = 14;
        //res.body.runningRoute.j = true;
      }
    });
  };

});
