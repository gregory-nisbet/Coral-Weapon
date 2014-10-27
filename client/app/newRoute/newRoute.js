angular.module('shortly.newRoute', [])
.controller('NewRouteController', function ($scope, $location, RunningRoutes) {

  $scope.runningRoute = {};

  $scope.addRunningRoute = function () {
    $scope.loading = true;
    $scope.runningRoute.runningRoute = res;
    $scope.runningRoute.rating = $('.difficulty').text();
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
    genLoop();
  };

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

  var genLoop = function(){
    var wayPtArr = [];
    var randomDest = getRandomDest();
    var pt1 = new google.maps.LatLng(currentLatitude, currentLongitude+randomDest);
    var pt2 = new google.maps.LatLng(pt1.k, pt1.B+0.001);
    var pt3 = new google.maps.LatLng(pt2.k-0.002, pt2.B-0.005);
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
      }
    });
  };

});
