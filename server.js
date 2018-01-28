// express server setup
var express = require('express');
var app = express();
var router = express.Router();

// server variables
var path = __dirname + '/build/';
var port = 8080;

// rugby game variables
var games = [];
var players = [];

// setup socket io
var io = require('socket.io').listen(app.listen(port, function () {
  console.log("Server now running at port " + port);
}));
io.set('transports', [
  'polling'
  , 'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

// on socket connection
io.on('connection', function (socket) {
  // once connected, we emit to client that they are connected (server only communication)
  socket.emit('connected', { message: 'hello world' });

  // test event to check if client is connecting to this socket server (2 way communication)
  socket.on('myEvent', function(data) {
    socket.emit('myEvent', { message: 'pong' });
  });
});

// setup routes
var indexRoute = require('./server/routes/index');

// url route handlers
app.use('/', indexRoute);
app.use('/static', express.static(path + 'static/'));
app.use('/service-worker.js', express.static(path + '/service-worker.js'));

module.exports = app;
