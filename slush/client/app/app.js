
angular.module('y', [
  'ngRoute',
  'y.newRoute',
  'y.runningroute'
])
.config(function ($routeProvider) {
  'use strict';
  $routeProvider
    .when('/newRoute', {
      controller: 'newRouteCtrl',
      templateUrl: '/y/newRoute/newRoute.html'
    })
    .when('/savedRoutes', {
      controller: 'RunningRouteCtrl',
      templateUrl: '/y/runningroute/runningroute.html'
    })
    .otherwise({
      redirectTo: '/savedRoutes'
    });
});
