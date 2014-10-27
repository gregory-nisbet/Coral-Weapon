angular
  .module('y.runningroute')
  .controller('RunningRouteCtrl', function ($scope, $window, $http) {
    'use strict';
    $http
      .post('http://localhost:8000/api/auth/local', {email:'admin@admin.com', password:'admin'})
      .then(function(data){
        console.log('logged in ', data);
      })

    $scope.todos = JSON.parse($window.localStorage.getItem('runningroutes') || '[]');
    $scope.$watch('runningroutes', function (newRunningRoutes, oldRunningRoutes) {
      if (newRunningRoutes !== oldRunningRoutes) {
        $window.localStorage.setItem('runningroutes', JSON.stringify(angular.copy($scope.runningroutes)));
      }
    }, true);

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

    };

    $scope.saveRoute = function(){

    };
  });
