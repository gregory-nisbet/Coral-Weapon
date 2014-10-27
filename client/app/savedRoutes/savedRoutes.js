angular.module('shortly.savedRoutes', [])

.controller('SavedRoutesController', function ($scope, runningRoutes, $window, RunningRoutes) { // $log) {
//                'savedRoutesCtrl', function ($scope, $window, $http)

  $scope.data = {runningRoutes: runningRoutes};
  $scope.getRunningRoutes = function () {
    RunningRoutes.getAll()
      .then(function (runningRoutes) {
        $scope.data.runningRoutes = runningRoutes;
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  $scope.getRunningRoutes();

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
