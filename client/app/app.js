angular.module('shortly', [
  'shortly.auth',
  'shortly.auth.services',
  'shortly.savedRoutes',
  'shortly.savedRoutes.services',
  'shortly.newRoute',
  'shortly.team',
  'ui.router'//,
//  'ngFx'
])
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $compileProvider) {
  // $routeProvider
  //   .when('/signin', {
  //     templateUrl: 'app/auth/signin.html',
  //     controller: 'AuthController'
  //   })
  //   .when('/signup', {
  //     templateUrl: 'app/auth/signup.html',
  //     controller: 'AuthController'
  //   })
  //   // Your code here
  //   /* START SOLUTION */
  //   .when('/links', {
  //     templateUrl: 'app/links/links.html',
  //     controller: 'LinksController',
  //     authenticate: true,
  //     resolve: {
  //       links: function(Links) {
  //         return Links.getAll();
  //       }
  //     }
  //   })
  //   .when('/shorten', {
  //     templateUrl: 'app/shorten/shorten.html',
  //     controller: 'ShortenController',
  //     authenticate: true,
  //   })
  //   .otherwise({
  //     redirectTo: '/links'
  //   });
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/);

  $urlRouterProvider.otherwise('/savedRoutes');

  $stateProvider
    .state('signup', {
      url: '/signup',
      controller: 'AuthController',
      templateUrl: 'app/auth/signup'
    })
    .state('signin', {
      url: '/signin',
      controller: 'AuthController',
      templateUrl: 'app/auth/signin'
    })
    .state('team', {
      url: '/team',
      controller: 'TeamController',
      templateUrl: 'app/team/team.html'
    })
    .state('savedRoutes', {
      url: '/savedRoutes',
      controller: 'SavedRoutesController',
      templateUrl: 'app/savedRoutes/savedRoutes.html',
      resolve: {
        runningRoutes: function(RunningRoutes) {
          return RunningRoutes.getAll();
        }
      }
    })
    .state('savedRoutes.child', {
      url: '/child',
      template: '<h1>CHILD</h1>'
    })
    .state('newRoute', {
      url: '/newRoute',
      controller: 'NewRouteController',
      templateUrl: 'app/newRoute/newRoute.html'
    });

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
})
.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.shortly');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});
