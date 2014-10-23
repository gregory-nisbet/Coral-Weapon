/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var RunningRoute = require('./runningroute.model');

RunningRoute.find({}).remove(function() {
  RunningRoute.create({
    name: 'Running Route 1',
    rating: 5.0,
    runningroute: {}
  },{
    name: 'Running Route 2',
    rating: 4.0,
    runningroute: {}
  },{
    name: 'Running Route 3',
    rating: 3.0,
    runningroute: {}
  },{
    name: 'Running Route 4',
    rating: 2.0,
    runningroute: {}
  },{
    name: 'Running Route 5',
    rating: 1.0,
    runningroute: {}
  }, function() {

      RunningRoute.find(function(err, runningroutes){
        console.log('finished populating runningroutes', runningroutes);
      })
    }
  );
});
