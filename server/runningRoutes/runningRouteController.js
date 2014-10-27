var RunningRoute = require('./runningRouteModel.js'),
    Q = require('q'),
    util = require('../config/utils.js');


module.exports = {
  // findUrl: function (req, res, next, code) {
  findRunningRoute: function (req, res, next, code) {
    var findRunningRoute = Q.nbind(RunningRoute.findOne, RunningRoute);
    findRunningRoute({code: code})
      .then(function (runningRoute) {
        if (runningRoute) {
          req.navRunningRoute = runningRoute;
          next();
        } else {
          next(new Error('RunningRoute not added yet'));
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  allRunningRoutes: function (req, res, next) {
    var findAll = Q.nbind(RunningRoute.find, RunningRoute);

    findAll({})
      .then(function (runningRoutes) {
        res.json(runningRoutes);
      })
      .fail(function (error) {
        next(error);
      });
  },

  newRunningRoute: function (req, res, next) {
    //var url = req.body.url;
    console.log("newRunningRoute()");
    var runningRoute = req.body.runningRoute;
    console.log("req.body: ", req.body);
    // if (!util.isValidUrl(url)) {
    //   return next(new Error('Not a valid url'));
    // }

    var createRunningRoute = Q.nbind(RunningRoute.create, RunningRoute);
    var findRunningRoute = Q.nbind(RunningRoute.findOne, RunningRoute);

    // findRunningRoute({url: url})
    findRunningRoute({runningRoute: runningRoute})
      .then(function (match) {
        if (match) {
          res.send(match);
        } else {
          //return  util.getUrlTitle(url);
          //console.log("req.body.name", req.body.name);
          return req.body.name;
        }
      })
      // .then(function (title) {
      //   if (title) {
      .then(function (name) {
        if (name) {
          // console.log("name: ", name);
          // console.log("runningRoute: ", runningRoute);
          var newRunningRoute = {
            // url: url,
            // visits: 0,
            // base_url: req.headers.origin,
            // title: title
            name: name,
            runningRoute: runningRoute,
            //code: req.body.code, //code: sandwich <- error is on sandwich
            rating: req.body.rating // rating: chicken <- error is on chicken
          };
          return createRunningRoute(newRunningRoute);
        }
      })
      .then(function (createdRunningRoute) {
        if (createdRunningRoute) {
          res.json(createdRunningRoute);
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  navToRunningRoute: function (req, res, next) {
    console.log("req.navRunningRoute: ", req.navRunningRoute);
    //console.log("req: ", req);
    var runningRoute = req.navRunningRoute;
    //runningRoute.visits++;
    runningRoute.save(function (err, savedRunningRoute) {
      if (err) {
        next(err);
      } else {
        // res.redirect(savedRunningRoute.url);

        // load req.navRunningRoute.runningRoute onto map-canvas
        res.send(req.navRunningRoute);
      }
    });
  }

};
