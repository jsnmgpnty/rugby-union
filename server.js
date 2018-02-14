var express = require('express');
var bodyParser = require('body-parser')
var uuid = require('uuid');
var _ = require('lodash');
var redisConf = require('./server/redisEnv');
var redis = require('redis');

var port = process.env.PORT || 8080;
var connString = process.env.NODE_ENV === 'prod' ? redisConf.prod.uri : redisConf.local.uri;
var redisSubscriber = process.env.NODE_ENV === 'prod' ?
  redis.createClient(6380, 'whg-engagement-app.redis.cache.windows.net', {
    auth_pass: 'sjwiA428Y90Mp9nCf7XXYmYCc5QperJJoqR5dR+rpFY=',
    tls: {
      servername: 'whg-engagement-app.redis.cache.windows.net'
    }
  }) :
  redis.createClient(connString);

// express server setup
var app = express();
var router = express.Router();

// server variables
var path = __dirname + '/build/';

// apply request parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ======================================
// socket io setup
// ======================================

var io = require('socket.io').listen(app.listen(port, function () {
  console.log('Server now running at port ' + port);
}));
io.set('transports', [
  'polling'
  , 'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

var connectedClients = [];

function removeDisconnectedClients() {
  _.remove(connectedClients, function (client) {
    return client.socket.disconnected;
  });
}

function getSocketBySession(userId) {
  removeDisconnectedClients();
  var connectedClient = _.find(connectedClients, function (a) { return a.userId === userId; });
  return connectedClient ? connectedClient.socket : null;
}

function removeSocketBySocketId(socketIdInternal) {
  removeDisconnectedClients();
  let index = null;

  for (let i = 0; i < connectedClients.length; i++) {
    if (connectedClients[i].socket && connectedClients[i].socketIdInternal === socketIdInternal) {
      index = i;
      break;
    }
  }

  if (!_.isNil(index)) {
    connectedClients.splice(index, 1);
  }
}

function onUserLoggedIn(data) {
  io.sockets.emit('user:loggedin', data);
  var socket = getSocketBySession(data.userId);
  if (socket)
    socket.join(data.userId);
}

function onGameCreated(data) {
  console.log('game:created ' + JSON.stringify(data));
  io.sockets.emit('game:created', data);
}

function onGameJoined(data) {
  if (!data || !data.game || !data.userAvatar) {
    return;
  }

  var socket = getSocketBySession(data.userAvatar.userId);

  if (socket) {
    socket.join(data.game.gameId);
    socket.currentGameId = data.game.gameId;
    socket.currentTeamId = data.teamId;

    console.log('game:joined ' + JSON.stringify(data));
    io.to(data.game.gameId).emit('game:joined', data);
  }
}

function onGameLeft(data) {
  if (!data || !data.game) {
    return;
  }

  var socket = getSocketBySession(data.userId);

  if (socket) {
    socket.leave(data.game.gameId);
    socket.leave(data.game.teamId);
    socket.currentGameId = null;
    socket.currentTeamId = null;

    io.to(data.gameId).emit('game:left', data);
    io.to(data.teamId).emit('game:left', data);
  }
}

function onGameStarted(data) {
  if (!data || !data.game) {
    return;
  }

  io.to(data.game.gameId).emit('game:started', data);
}

function onGameScoreboardResult(data) {
  io.to(date.gameId).emit('game:result:scoreboard:turn', data);
}

function onGameTeamResult(data) {
  io.to(date.teamId).emit('game:result:team:turn', data);
}

function onGameScoreboardFinalResult(data) {
  io.to(date.gameId).emit('game:result:scoreboard:finished', data);

  var socket = getSocketBySession(data.userId);

  if (socket) {
    socket.leave(data.gameId);
    socket.leave(data.teamId);
  }
}

function onGameTeamFinalResult(data) {
  io.to(date.gameId).emit('game:result:team:finished', data);

  var socket = getSocketBySession(data.userId);

  if (socket) {
    socket.leave(data.gameId);
    socket.leave(data.teamId);
  }
}

// on socket connection
io.on('connection', function (socket) {
  // once connected, we emit to client that they are connected (server only communication)
  socket.emit('connected', { message: 'You are connected to Rugby Union! Whooooo!' });
  socket.socketIdInternal = uuid();

  socket.on('user:session', function (data) {
    var connectedClient = getSocketBySession(data.userId);
    if (!connectedClient) {
      connectedClients.push({ userId: data.userId, socket: socket });
    }
  });

  socket.on('game:join', function (data) {
    var connectedClient = getSocketBySession(data.userId);
    if (!connectedClient) {
      connectedClients.push({ userId: data.userId, socket: socket });
    }

    connectedClient.join(data.gameId);
    socket.join(data.gameId);
  });

  socket.on('disconnection', function () {
    removeSocketBySocketId(socket.socketIdInternal);
  })
});

redisSubscriber.subscribe("whg:app");
redisSubscriber.on("message", function (channel, message) {
  try {
    var messageJson = JSON.parse(message);
    switch (messageJson.topic) {
      case 'user:loggedin':
        onUserLoggedIn(messageJson.payload);
        break;
      case 'game:joined':
        onGameJoined(messageJson.payload);
        break;
      case 'game:left':
        onGameLeft(messageJson.payload);
        break;
      case 'game:started':
        onGameStarted(messageJson.payload);
        break;
      case 'game:created':
        onGameCreated(messageJson.payload);
        break;
      case 'game:result:team:turn':
        onGameTeamResult(messageJson.payload);
        break;
      case 'game:result:scoreboard:turn':
        onGameScoreboardResult(messageJson.payload);
        break;
      case 'game:result:team:finished':
        onGameFinalResult(messageJson.payload);
        break;
      case 'game:result:scoreboard:finished':
        onGameScoreboardFinalResult(messageJson.payload);
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(err);
  }
});

var indexRoute = require('./server/routes/index');
app.use('/', indexRoute);
app.use('/static', express.static(path + 'static/'));
app.use('/service-worker.js', express.static(path + '/service-worker.js'));

module.exports = app;
