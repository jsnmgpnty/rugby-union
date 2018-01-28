// express server setup
var express = require('express');
var app = express();
var router = express.Router();

var path = __dirname + '/build/';
var port = 58784;

var games = [];
var players = [];
var clientFunctions = {};

// setup socket io
var io = require('socket.io').listen(app.listen(port));
io.set('transports', [
  'polling'
  , 'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

// server request handler
router.use(function (req, res, next) {
  console.log('/' + req.method);
  next();
});

// main page request handler
router.get('/', function(req, res){
  res.sendFile(path + 'index.html');
});

// url route handlers
app.use('/', router);
app.use('/static', express.static(path + 'static/'));

// on socket connection
io.on('connection', function (socket) {
  // once connected, we emit to client that they are connected (server only communication)
  socket.emit('connected', { message: 'hello world' });

  // test event to check if client is connecting to this socket server (2 way communication)
  socket.on('myEvent', function(data) {
    socket.emit('myEvent', { message: 'pong' });
  });
});

module.exports = app;
 