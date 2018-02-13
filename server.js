const express = require('express');
const bodyParser = require('body-parser')
const uuid = require('uuid');
const _ = require('lodash');
const redisConf = require('./server/redisEnv');
const redis = require('redis');

const port = process.env.PORT || 8080;
const connString = process.env.NODE_ENV === 'prod' ? redisConf.prod.uri : redisConf.local.uri;
const redisSubscriber = redis.createClient(connString);

// express server setup
const app = express();
const router = express.Router();

// server variables
const path = __dirname + '/build/';

// apply request parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ======================================
// socket io setup
// ======================================

const io = require('socket.io').listen(app.listen(port, function () {
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

const connectedClients = [];

const getSocketBySession = (userId) => {
  const connectedClient = connectedClients.find(a => a.userId === userId);
  return connectedClient ? connectedClient.socket : null;
}

const removeSocketBySocketId = (socketIdInternal) => {
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

const onUserLoggedIn = (data) => {
  io.sockets.emit('user:loggedin', data);
  const socket = getSocketBySession(data.userId);
  if (socket)
    socket.join(data.userId);
}

const onGameCreated = (data) => {
  io.sockets.emit('game:created', data);
}

const onGameJoined = (data) => {
  const socket = getSocketBySession(data.userId);

  if (socket) {
    socket.join(data.gameId);
    socket.join(data.teamId);
    socket.currentGameId = data.gameId;
    socket.currentTeamId = data.teamId;

    io.to(data.gameId).emit('game:joined', data);
    io.to(data.teamId).emit('game:joined', data);
  }
}

const onGameLeft = (data) => {
  const socket = getSocketBySession(data.userId);

  if (socket) {
    socket.leave(data.gameId);
    socket.leave(data.teamId);
    socket.currentGameId = null;
    socket.currentTeamId = null;

    io.to(data.gameId).emit('game:left', data);
    io.to(data.teamId).emit('game:left', data);
  }
}

const onGameStarted = (data) => {
  io.to(data.gameId).emit('game:started', data);
}

const onGameScoreboardResult = (data) => {
  io.to(date.gameId).emit('game:result:scoreboard:turn', data);
}

const onGameTeamResult = (data) => {
  io.to(date.teamId).emit('game:result:team:turn', data);
}

const onGameScoreboardFinalResult = (data) => {
  io.to(date.gameId).emit('game:result:scoreboard:finished', data);

  const socket = getSocketBySession(data.userId);

  if (socket) {
    socket.leave(data.gameId);
    socket.leave(data.teamId);
  }
}

const onGameTeamFinalResult = (data) => {
  io.to(date.gameId).emit('game:result:team:finished', data);

  const socket = getSocketBySession(data.userId);

  if (socket) {
    socket.leave(data.gameId);
    socket.leave(data.teamId);
  }
}

// on socket connection
io.on('connection', (socket) => {
  // once connected, we emit to client that they are connected (server only communication)
  socket.emit('connected', { message: 'You are connected to Rugby Union! Whooooo!' });
  socket.socketIdInternal = uuid();

  socket.on('user:session', (data) => {
    const connectedClient = getSocketBySession(data.userId);
    if (!connectedClient) {
      connectedClients.push({ userId: data.userId, socket: socket });
    }
  });

  socket.on('game:view', (data) => {
    const connectedClient = getSocketBySession(data.userId);
    if (!connectedClient) {
      connectedClients.push({ userId: data.userId, socket: socket });
    }
  });

  socket.on('disconnection', async () => {
    removeSocketBySocketId(socket.socketIdInternal);
  })
});

redisSubscriber.subscribe("whg:app");
redisSubscriber.on("message", function (channel, message) {
  try {
    var messageJson = JSON.parse(message);
    switch (messageJson.Topic) {
      case 'user:loggedin':
        onUserLoggedIn(messageJson.Payload);
        break;
      case 'game:joined':
        onGameJoined(messageJson.Payload);
        break;
      case 'game:left':
        onGameLeft(messageJson.Payload);
        break;
      case 'game:started':
        onGameStarted(messageJson.Payload);
        break;
      case 'game:created':
        onGameCreated(messageJson.Payload);
        break;
      case 'game:result:team:turn':
        onGameTeamResult(messageJson.Payload);
        break;
      case 'game:result:scoreboard:turn':
        onGameScoreboardResult(messageJson.Payload);
        break;
      case 'game:result:team:finished':
        onGameFinalResult(messageJson.Payload);
        break;
      case 'game:result:scoreboard:finished':
        onGameScoreboardFinalResult(messageJson.Payload);
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
