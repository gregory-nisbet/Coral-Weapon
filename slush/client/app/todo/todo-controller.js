angular
  .module('y.todo')
  .controller('TodoCtrl', function ($scope, $window, $http) {
    'use strict';

    $http
      .post('http://localhost:8000/api/auth/local', {email:'admin@admin.com', password:'admin'})
      .then(function(data){
        console.log('logged in ', data);
      })

    $scope.todos = JSON.parse($window.localStorage.getItem('todos') || '[]');
    $scope.$watch('todos', function (newTodos, oldTodos) {
      if (newTodos !== oldTodos) {
        $window.localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos)));
      }
    }, true);

    $scope.add = function () {
      var todo = {label: $scope.label, isDone: false};
      $scope.todos.push(todo);
      $window.localStorage.setItem('todos', JSON.stringify(angular.copy($scope.todos)));
      $scope.label = '';
    };

    $scope.check = function () {
      this.todo.isDone = !this.todo.isDone;
    };
  });
