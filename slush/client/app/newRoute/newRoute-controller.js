angular
  .module('y.newRoute')
  .controller('newRouteCtrl', function ($scope, $window, $http) {
    'use strict';
    $http
      .post('http://localhost:8000/api/auth/local', {email:'admin@admin.com', password:'admin'})
      .then(function(data){
        console.log('logged in ', data);
      })

    $scope.add = function () {
      var runningroute = {label: $scope.label, isDone: false};
      $scope.runningroutes.push(runningroute);
      $window.localStorage.setItem('runningroutes', JSON.stringify(angular.copy($scope.runningroutes)));
      $scope.label = '';
    };

    $scope.check = function () {
      this.runningroute.isDone = !this.runningroute.isDone;
    };

    $scope.generateRoute = function(){
      console.log('generating route!');
    };

    $scope.saveRoute = function(){
      console.log('saving the route!')
    };
  });
