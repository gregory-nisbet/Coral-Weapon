'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RunningRouteSchema = new Schema({
  name: String,
  rating: Number,
  runningroute: Object
});

module.exports = mongoose.model('RunningRoute', RunningRouteSchema);
