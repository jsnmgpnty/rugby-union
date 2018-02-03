const express = require('express');
const bodyParser = require('body-parser')
const uuid = require('uuid');
const _ = require('lodash');
const GameService = require('./server/services/gameService');
const gameService = new GameService();

// express server setup
const app = express();
const router = express.Router();

// server variables
const path = __dirname + '/build/';
const port = 8080;

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

// on socket connection
io.on('connection', (socket) => {
  // once connected, we emit to client that they are connected (server only communication)
  socket.emit('connected', { message: 'You are connected to Rugby Union! Whooooo!' });

  socket.on('user:create', (data) => {
    if (data && data.userId && data.username) {
      socket.user = data;
      socket.join(data.userId);
      socket.emit('user:created', data);
      socket.broadcast.emit('user:created', data);
    } else {
      socket.emit('user:created', { error: 'Failed to sign in your username. Please try again.' });
    }
  });

  socket.on('game:create', async (data) => {
    try {
      const game = await gameService.createGame(data);

      if (game && game.gameId) {
        // join game and extend socket
        socket.join(game.gameId);
        socket.currentGameId = game.gameId;
        socket.emit('game:created', game);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('game:join', async (data) => {
    try {
      const joinGameResult = await gameService.joinGame(data);

      if (!joinGameResult.error) {
        if (socket.gameId !== data.gameId) {
          socket.join(joinGameResult.gameId);
          socket.currentGameId = game.gameId;
        }

        if (socket.currentTeamId !== data.teamId) {
          socket.join(joinGameResult.teamId);
          socket.currentTeamId = data.teamId;
        } else {
          socket.leave(joinGameResult.gameId);
        }

        io.to(joinGameResult.gameId).emit('game:joined', {
          gameId: joinGameResult.gameId,
          teamId: joinGameResult.teamId,
          username: joinGameResult.username,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('game:leave', async (data) => {
    try {
      const request = {
        gameId: data.gameId || socket.currentGameId,
        teamId: data.teamId || socket.currentTeamId,
        username: data.username || _.get(socket, 'user.username', ''),
      };
      const gameLeaveResult = await gameService.leaveGame(request);

      if (!gameLeaveResult.error) {
        socket.leave(gameLeaveResult.gameId);
        socket.currentGameId = null;

        io.to(joinGameResult.gameId).emit('game:leave', {
          gameId: joinGameResult.gameId,
          teamId: joinGameResult.teamId,
          username: joinGameResult.username,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnection', async () => {

  })
});

var indexRoute = require('./server/routes/index');
app.use('/', indexRoute);
var gameApiRoutes = require('./server/routes/gameApi')();
app.use('/api', gameApiRoutes);
var countryApiRoutes = require('./server/routes/countryApi')();
app.use('/api', countryApiRoutes);
app.use('/static', express.static(path + 'static/'));
app.use('/service-worker.js', express.static(path + '/service-worker.js'));

module.exports = app;
