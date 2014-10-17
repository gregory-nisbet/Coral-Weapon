
angular.module('y', [
  'ngRoute',
  'y.todo'
])
.config(function ($routeProvider) {
  'use strict';
  $routeProvider
    .when('/todo', {
      controller: 'TodoCtrl',
      templateUrl: '/y/todo/todo.html'
    })
    .otherwise({
      redirectTo: '/todo'
    });
});
