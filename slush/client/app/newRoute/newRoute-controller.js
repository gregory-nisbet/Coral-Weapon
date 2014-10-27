angular
  .module('y.newRoute')
  .controller('newRouteCtrl', function ($scope, $window, $http) {
    'use strict';
    $http
      .post('http://localhost:8000/api/auth/local', {email:'admin@admin.com', password:'admin'})
      .then(function(data){
        console.log('logged in ', data);
      });

    $scope.generateRoute = function(){
      console.log('generating route!');
      genLoop();
    };

    $scope.saveRoute = function(){
      console.log('saving the route!');
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
        stopover: true
      }, {
        location: pt2, 
        stopover: true
      },{
        location: pt3, 
        stopover: true
      })
      var request = getRequest(currentPosition, currentPosition, wayPtArr);
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          drawChart(response);
        }
      });
    };

  });
