const express = require('express');
const bodyParser = require('body-parser')
const uuid = require('uuid');
const _ = require('lodash');
const turnStatus = require('./server/models/turnStatusEnum');
const gameStatus = require('./server/models/gameStatusEnum');
const GameService = require('./server/services/gameService');
const gameService = new GameService();
const IoService = require('./server/services/ioService');
const ioService = new IoService();

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

  socket.on('user:create', async (data) => {
    if (data && data.userId && data.username) {
      if (!data.isReturningUser) {
        const user = await gameService.getUserByUsername(data.username);
        console.log(user);
        
        if (user) {
          socket.emit('user:created', { error: 'Username is already in use' });
          return;
        }
      }

      socket.user = data;
      socket.join(data.userId);
      socket.emit('user:created', data);
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
          socket.currentGameId = joinGameResult.gameId;
        }

        if (socket.currentTeamId !== data.teamId) {
          socket.join(joinGameResult.teamId);
          socket.currentTeamId = data.teamId;
        }

        if (socket.currentAvatarId !== data.avatarId) {
          socket.currentAvatarId = data.avatarId;
        }

        io.to(joinGameResult.gameId).emit('game:joined', {
          gameId: joinGameResult.gameId,
          teamId: joinGameResult.teamId,
          username: joinGameResult.username,
          avatarId: joinGameResult.avatarId,
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
        socket.currentGameId = null;
        socket.currentTeamId = null;

        io.to(gameLeaveResult.gameId).emit('game:leave', {
          gameId: gameLeaveResult.gameId,
          teamId: gameLeaveResult.teamId,
          username: gameLeaveResult.username,
        });
        socket.leave(gameLeaveResult.gameId);
        socket.leave(gameLeaveResult.teamId);
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('game:start', async (data) => {
    try {
      const gameStartResult = await gameService.startGame(data);

      if (!gameStartResult.error) {
        io.to(gameStartResult.gameId).emit('game:started', { gameId: gameStartResult.gameId });
        io.to(gameStartResult.gameId).emit('game:scoreboard', {
          gameId: gameStartResult.gameId,
          currentTurn: gameStartResult.turnNumber,
          turnStatus: gameStartResult.latestTurn.status,
        });

        io.to(gameStartResult.ballHandlerTeam).emit('game:turn', { gameId: gameStartResult.gameId, turn: { status: turnStatus.passing } });
        io.to(gameStartResult.tacklingTeam).emit('game:turn', { gameId: gameStartResult.gameId, turn: { status: turnStatus.passing } });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('game:ball:pass', async (data) => {
    try {
      const passResult = await gameService.passBall(data);

      if (!passResult.error) {
        io.to(passResult.gameId).emit('game:scoreboard', {
          gameId: passResult.gameId,
          currentTurn: passResult.turnNumber,
          turnStatus: passResult.latestTurn.status,
        });

        io.to(passResult.ballHandlerTeam).emit('game:turn', { gameId: passResult.gameId, turn: { status: turnStatus.voting } });
        io.to(passResult.tacklingTeam).emit('game:turn', { gameId: passResult.gameId, turn: { status: turnStatus.voting } });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('game:ball:guess', async (data) => {
    try {
      const guessResult = await gameService.guessBallHandler(data);

      if (!guessResult.error && guessResult.gameId) {
        const turnResult = await gameService.evaluateGameResult(guessResult.gameId);

        if (!turnResult.winningTeam) {
          io.to(turnResult.gameId).emit('game:scoreboard', {
            gameId: turnResult.gameId,
            currentTurn: turnResult.totalTurns,
            turnStatus: turnResult.latestTurn.status,
          });

          io.to(guessResult.ballHandlerTeam).emit('game:turn', { gameId: turnResult.gameId, turn: { status: turnStatus.voting } });
          io.to(guessResult.tacklingTeam).emit('game:turn', { gameId: turnResult.gameId, turn: { status: turnStatus.voting } });
        } else {
          io.to(turnResult.gameId).emit('game:scoreboard', {
            gameId: turnResult.gameId,
            currentTurn: turnResult.totalTurns,
            turnStatus: turnResult.latestTurn.status,
            winningTeam: turnResult.winningTeam,
            isTackled: turnResult.isTackled,
            isTouchdown: turnResult.isTouchdown,
          });

          if (turnResult.isTouchdown) {
            io.to(turnResult.tacklingTeam).emit('game:completed', { gameId: turnResult.gameId, status: 'LOST' });
            io.to(turnResult.ballHandlerTeam).emit('game:completed', { gameId: turnResult.gameId, status: 'WON' });
          } else {
            io.to(turnResult.tacklingTeam).emit('game:completed', { gameId: turnResult.gameId, status: 'WON' });
            io.to(turnResult.ballHandlerTeam).emit('game:completed', { gameId: turnResult.gameId, status: 'LOST' });
          }
        }
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
