const uuid = require('uuid');
const _ = require('lodash');
const Game = require('../models/game');
const Team = require('../models/team');
const User = require('../models/user');
const BaseService = require('./baseService');
const GameService = require('./gameService');
const gameService = new GameService();

const EmittableTopics = {
  userCreated: 'user:created',
  gameCreated: 'game:created',
  gameJoined: 'game:joined',
  gameLeave: 'game:leave',
  gameStarted: 'game:started',
  gameCompleted: 'game:completed',
  gameScoreboard: 'game:scoreboard',
  gameTurn: 'game:turn',
};

class IoService extends BaseService {
  onUserCreate (io, socket, data) {
    if (data && data.userId && data.username) {
      socket.user = data;
      socket.join(data.userId);
      socket.emit(EmittableTopics.userCreated, data);
      socket.broadcast.emit(EmittableTopics.userCreated, data);
    } else {
      socket.emit(EmittableTopics.userCreated, { error: 'Failed to sign in your username. Please try again.' });
    }
  }

  async onGameCreate (io, socket, data) {
    try {
      const game = await gameService.createGame(data);

      if (game && game.gameId) {
        // join game and extend socket
        socket.join(game.gameId);
        socket.currentGameId = game.gameId;
        socket.emit(EmittableTopics.gameCreated, game);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onGameJoin (io, socket, data) {
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

        io.to(joinGameResult.gameId).emit(EmittableTopics.gameJoined, {
          gameId: joinGameResult.gameId,
          teamId: joinGameResult.teamId,
          username: joinGameResult.username,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onGameLeave (io, socket, data) {
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

        io.to(joinGameResult.gameId).emit(EmittableTopics.gameLeave, {
          gameId: joinGameResult.gameId,
          teamId: joinGameResult.teamId,
          username: joinGameResult.username,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onGameStart (io, socket, data) {
    try {
      const gameStartResult = await gameService.startGame(data);

      if (!gameStartResult.error) {
        io.to(gameStartResult.gameId).emit(EmittableTopics.gameStarted, { gameId: gameStartResult.gameId });
        io.to(gameStartResult.gameId).emit(EmittableTopics.gameScoreboard, {
          gameId: gameStartResult.gameId,
          currentTurn: gameStartResult.turnNumber,
          turnStatus: gameStartResult.latestTurn.status,
        });

        io.to(gameStartResult.ballHandlerTeam).emit(EmittableTopics.gameTurn, { gameId: gameStartResult.gameId, turn: { status: turnStatus.passing } });
        io.to(gameStartResult.tacklingTeam).emit(EmittableTopics.gameTurn, { gameId: gameStartResult.gameId, turn: { status: turnStatus.passing } });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onBallPass (io, socket, data) {
    try {
      const passResult = await gameService.passBall(data);

      if (!passResult.error) {
        io.to(passResult.gameId).emit(EmittableTopics.gameScoreboard, {
          gameId: passResult.gameId,
          currentTurn: passResult.turnNumber,
          turnStatus: passResult.latestTurn.status,
        });

        io.to(passResult.ballHandlerTeam).emit(EmittableTopics.gameTurn, { gameId: passResult.gameId, turn: { status: turnStatus.voting } });
        io.to(passResult.tacklingTeam).emit(EmittableTopics.gameTurn, { gameId: passResult.gameId, turn: { status: turnStatus.voting } });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async onGuessBallHandler (io, socket, data) {
    try {
      const guessResult = await gameService.guessBallHandler(data);

      if (!guessResult.error && guessResult.gameId) {
        const turnResult = await gameService.evaluateGameResult(guessResult.gameId);

        if (!turnResult.winningTeam) {
          io.to(turnResult.gameId).emit(EmittableTopics.gameScoreboard, {
            gameId: turnResult.gameId,
            currentTurn: turnResult.totalTurns,
            turnStatus: turnResult.latestTurn.status,
          });

          io.to(guessResult.ballHandlerTeam).emit(EmittableTopics.gameTurn, { gameId: turnResult.gameId, turn: { status: turnStatus.voting } });
          io.to(guessResult.tacklingTeam).emit(EmittableTopics.gameTurn, { gameId: turnResult.gameId, turn: { status: turnStatus.voting } });
        } else {
          io.to(turnResult.gameId).emit(EmittableTopics.gameScoreboard, {
            gameId: turnResult.gameId,
            currentTurn: turnResult.totalTurns,
            turnStatus: turnResult.latestTurn.status,
            winningTeam: turnResult.winningTeam,
            isTackled: turnResult.isTackled,
            isTouchdown: turnResult.isTouchdown,
          });

          if (turnResult.isTouchdown) {
            io.to(turnResult.tacklingTeam).emit(EmittableTopics.gameCompleted, { gameId: turnResult.gameId, status: 'LOST' });
            io.to(turnResult.ballHandlerTeam).emit(EmittableTopics.gameCompleted, { gameId: turnResult.gameId, status: 'WON' });
          } else {
            io.to(turnResult.tacklingTeam).emit(EmittableTopics.gameCompleted, { gameId: turnResult.gameId, status: 'WON' });
            io.to(turnResult.ballHandlerTeam).emit(EmittableTopics.gameCompleted, { gameId: turnResult.gameId, status: 'LOST' });
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = IoService;
