
angular.module('y', [
  'ngRoute',
  'y.runningroute'
])
.config(function ($routeProvider) {
  'use strict';
  $routeProvider
    .when('/runningroute', {
      controller: 'RunningRouteCtrl',
      templateUrl: '/y/runningroute/runningroute.html'
    })
    .otherwise({
      redirectTo: '/runningroute'
    });
});
