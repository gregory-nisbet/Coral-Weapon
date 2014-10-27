/* jshint strict:false, globalstrict:false */
/* global describe, it, beforeEach, inject, module */
describe('NewRouteCtrl', function () {
  var newRouteCtrl,
      scope;

  beforeEach(module('y'));

  beforeEach(inject(function ($injector) {
    scope = $injector.get('$rootScope');

    newRouteCtrl = function () {
      return $injector.get('$controller')('newRouteCtrl', {'$scope': scope});
    };
  }));

  // it('should add new runningroutes on add()', function () {
  //   var runningroute = {label: 'A new runningroute', isDone: false};
  //   newRouteCtrl();
  //   scope.label = runningroute.label;
  //   scope.add();
  //   scope.label.length.should.equal(0);
  //   scope.runningroutes.length.should.equal(1);
  //   scope.runningroutes[scope.runningroutes.length - 1].label.should.equal(runningroute.label);
  //   scope.runningroutes[scope.runningroutes.length - 1].isDone.should.equal(false);
  // });
});
