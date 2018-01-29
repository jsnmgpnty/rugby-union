var express = require('express');
var bodyParser = require('body-parser')
var uuid = require('uuid');
var _ = require('lodash');
var gameService = require('./server/services/gameService');

// express server setup
var app = express();
var router = express.Router();

// server variables
var path = __dirname + '/build/';
var port = 8080;

// apply request parsers
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.text({ type: 'text/html' }))

// ======================================
// socket io setup
// ======================================

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
  socket.on('myEvent', function (data) {
    socket.emit('myEvent', { message: 'pong' });
  });

  socket.on('game:create', function (data) {
    var game = gameService.createGame();

    if (game && game.id) {
      io.sockets.join(game.id);
      io.sockets.emit('game:created', game);
    }
  });

  socket.on('game:join', function (data) {
    var joinGameResult = gameService.joinGame(data);

    if (!joinGameResult.error) {
      io.sockets.in(joinGameResult.gameId).emit('game:joined', { gameId: joinGameResult.gameId, teamId: joinGameResult.teamid, username: joinGameResult.username });
    }
  });
});

var gameApiRoutes = require('./server/routes/gameApi')(io);
app.use('/api', gameApiRoutes);
var indexRoute = require('./server/routes/index');
app.use('/', indexRoute);
app.use('/static', express.static(path + 'static/'));
app.use('/service-worker.js', express.static(path + '/service-worker.js'));

module.exports = app;
