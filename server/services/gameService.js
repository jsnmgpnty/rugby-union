var uuid = require('uuid');
var _ = require('lodash');

// rugby game variables
var games = [];
var gameStatus = {
  inProgress: 'INPROGRESS',
  pending: 'PENDING',
  completed: 'COMPLETED',
};

// ======================================
// private methods and functionalities
// ======================================

// get games list
function getGamesList() {
  return games;
}

// get game
function getGame(io, gameId) {
  var game = _.find(games, function (g) {
    return g.id === gameId;
  });

  return game[0];
}

// create game
function createGame() {
  var gameId = uuid();
  var firstTeamId = uuid();
  var secondTeamId = uuid();

  var game = {
    id: gameId,
    name: 'Game ' + gameId,
    turns: [],
    players: [],
    teams: [
      {
        id: firstTeamId,
        sortOrder: 1,
      },
      {
        id: secondTeamId,
        sortOrder: 2,
      },
    ],
    status: gameStatus.pending,
    winningTeam: null,
    createdDate: new Date(),
  };

  games.push(game);

  return game;
}

// join game
function joinGame(data) {
  if (!data || !data.gameId || !data.username || !data.teamId) {
    console.log('game:join invalid parameter');
    return { error: 'game:join invalid parameter' };
  }

  var game = _.find(games, function (g) {
    return g.id == data.gameId;
  });

  if (!game) {
    console.log('game:join game with id ' + data.gameId + ' cannot be found');
    return { error: 'game:join game with id ' + data.gameId + ' cannot be found' };
  }

  for (var t = 0; t < game.teams.length; t++) {
    if (game.teams[t].id === data.teamId) {
      var existingPlayer = _.find(game.teams[i].players, function (p) {
        return p.username === data.username;
      });

      if (existingPlayer.length > 0) {
        console.log('game:join failed as user ' + data.username + ' is already in team ' + game.teams[t].id);
        return { error: 'game:join failed as user ' + data.username + ' is already in team ' + game.teams[t].id };
      }

      game.teams[t].players.push({
        username: data.username,
      });

      return data;
    }
  }

  return { error: 'game:join failed to join user ' + data.username + ' due to unknown reasons. maybe your fault. we dont make mistakes you know' };
}

module.exports = {
  createGame: createGame,
  getGamesList: getGamesList,
  getGame: getGame,
  joinGame: joinGame,
};