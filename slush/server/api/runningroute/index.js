'use strict';

var express = require('express');
var controller = require('./runningroute.controller');
module.exports = function(app){

  var router = express.Router();


  router.get('/', controller.index);
  router.get('/:id', controller.show);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.destroy);

  app.use('/api/runningroute', router);

  // module.exports = router;
}
