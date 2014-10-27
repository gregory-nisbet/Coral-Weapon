/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /runningroutes              ->  index
 * POST    /runningroutes              ->  create
 * GET     /runningroutes/:id          ->  show
 * PUT     /runningroutes/:id          ->  update
 * DELETE  /runningroutes/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var RunningRoute = require('./runningroute.model');

// Get list of running routes
exports.index = function(req, res) {
  RunningRoute.find(function (err, runningroutes) {
    if(err) { return handleError(res, err); }
    return res.json(200, runningroutes);
  });
};

// Get a single running route
exports.show = function(req, res) {
  RunningRoute.findById(req.params.id, function (err, runningroute) {
    if(err) { return handleError(res, err); }
    if(!runningroute) { return res.send(404); }
    return res.json(runningroute);
  });
};

// Creates a new running route in the DB.
exports.create = function(req, res) {
  RunningRoute.create(req.body, function(err, runningroute) {
    if(err) { return handleError(res, err); }
    return res.json(201, runningroute);
  });
};

// Updates an existing running route in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  RunningRoute.findById(req.params.id, function (err, runningroute) {
    if (err) { return handleError(res, err); }
    if(!runningroute) { return res.send(404); }
    var updated = _.merge(runningroute, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, runningroute);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  RunningRoute.findById(req.params.id, function (err, runningroute) {
    if(err) { return handleError(res, err); }
    if(!runningroute) { return res.send(404); }
    runningroute.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
