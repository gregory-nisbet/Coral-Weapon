angular.module('shortly.savedRoutes.services', [])

.factory('RunningRoutes', function ($http) {

  var getAll = function () {
    return $http({
      method: 'GET',
      url: '/api/runningRoutes'
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var addRunningRoute = function (runningRoute) {
    return $http({
      method: 'POST',
      url: '/api/runningRoutes',
      data: runningRoute
    });
  };

  return {
    getAll: getAll,
    addRunningRoute: addRunningRoute
  };

})
