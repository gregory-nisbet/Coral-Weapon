var mongoose = require('mongoose'),
    crypto   = require('crypto');

var RunningRouteSchema = new mongoose.Schema({
 // visits: Number,
 // link: String,
 // title: String,
 // code: String,
 // base_url: String,
 // url: String
 name: String,
 rating: Number,
 code: String,
 runningRoute: Object
});

// var createSha = function(url) {
var createSha = function(runningRoute) {
  var shasum = crypto.createHash('sha1');
  // shasum.update(url);
  shasum.update(JSON.stringify(runningRoute));
  return shasum.digest('hex').slice(0, 5);
};

RunningRouteSchema.pre('save', function(next){
  //var code = createSha(this.url);
  var code = createSha(this.runningRoute);
  this.code = code;
  next();
});

module.exports = mongoose.model('RunningRoute', RunningRouteSchema);
