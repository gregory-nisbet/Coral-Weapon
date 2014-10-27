angular.module('shortly.savedRoutes', [])

.controller('SavedRoutesController', function ($scope, runningRoutes, $window) { // $log) {
//                'savedRoutesCtrl', function ($scope, $window, $http)
  // Your code here
  /* START SOLUTION */

  $scope.data = {runningRoutes: runningRoutes};
  //$scope.data = {runningRoutes: runningRoutes};
  // $scope.getLinks = function () {
  //   Links.getAll()
  //     .then(function (links) {
  //       $scope.data.links = links;
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //     });
  // };
  // $scope.getLinks();
  /* END SOLUTION */

  $scope.savedRoutes = JSON.parse($window.localStorage.getItem('savedRoutes') || '[]');
  $scope.$watch('savedRoutes', function (newRunningRoutes, oldRunningRoutes) {
    if (newRunningRoutes !== oldRunningRoutes) {
      $window.localStorage.setItem('savedRoutes', JSON.stringify(angular.copy($scope.savedRoutes)));
    }
  }, true);

  $scope.check = function () {
    this.savedRoute.isDone = !this.savedRoute.isDone;
  };


})
.directive('shortenedRunningRoute', function() {
  return {
    restrict: 'E',
    scope: {
      runningRoute: '='
    },
    transclusion: true,
    replace: true,
    templateUrl: 'app/savedRoutes/savedRoutesWidget.html',
    runningRoute: function(scope, ele, attrs) {

    }
  };
});
