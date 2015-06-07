'use strict';

var io = require('socket.io');
var express = require('express');
var path = require('path');
var app = express();
var _ = require('lodash');
var http = require('http');
var fs = require('fs');

var logger = require('winston');
var config = require('./config')(logger);

app.use(express.static(path.resolve(__dirname, './public')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

var server = app.listen(config.server.port, function () {
  logger.info('Server listening on %s', config.server.port);
});

var sio = io(server);

// @todo extract in its own
sio.on('connection', function (socket) {
  socket.on('file:changed', function () {
    if (!socket.conn.request.isAdmin) {
      // if the user is not admin
      // skip this
      return socket.emit('error:auth', 'Unauthorized :)');
    }

    // forward the event to everyone
    sio.emit.apply(sio, ['file:changed'].concat(_.toArray(arguments)));
  });

  socket.visibility = 'visible';
  
  socket.on('user-visibility:changed', function (state) {
    socket.visibility = state;
    sio.emit('users:visibility-states', getVisibilityCounts());
  });

  Array.prototype.last = function() {
    return this[this.length-1];
  }

  socket.on('download', function(array){
    var object = array.last();
    logger.info("New download request : " + JSON.stringify(object));
    var file = fs.createWriteStream("shared/" + object.name);
    var request = http.get(object.uri, function(response) {
      var len = parseInt(response.headers['content-length'], 10);
      var body = "";
      var cur = 0;
      var total = len / 1048576; //1048576 - bytes in  1Megabyte

      response.on("data", function(chunk) {
        body += chunk;
        cur += chunk.length;
        object.progress = (100.0 * cur / len).toFixed(2);
        sio.emit('download:progress', object);
      });

      response.on("end", function() {
        sio.emit('download:completed', object);
      });

      request.on("error", function(){
        sio.emit('download:error', object);
      });

      response.pipe(file);
    });
  });
  });

function getVisibilityCounts() {
  return _.chain(sio.sockets.sockets).values().countBy('visibility').value();
}

function removeElement(array, element){
  var index = array.indexOf(element);

  if (index > -1){
    array.splice(index, 1);
  }

  return array;
}
