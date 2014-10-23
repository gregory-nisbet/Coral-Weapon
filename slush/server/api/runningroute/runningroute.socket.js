/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var runningroute = require('./runningroute.model');

exports.register = function(socket) {
  runningroute.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  runningroute.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  console.log('saved')
  socket.emit('runningroutes:save', doc);
}

function onRemove(socket, doc, cb) {
  console.log('removed')
  socket.emit('runningroutes:remove', doc);
}
