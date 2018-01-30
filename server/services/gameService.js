var uuid = require('uuid');
var _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;

var mongoDbPort = 27017;

// rugby game variables
var games = [];
var gameStatus = {
  inProgress: 'INPROGRESS',
  pending: 'PENDING',
  completed: 'COMPLETED',
};
var turnStatus = {
  voting: 'VOTING',
  passing: 'PASSING',
  completed: 'COMPLETED',
};

// setup database
var db;

MongoClient.connect('mongodb://mongo:' + mongoDbPort + '/rugby-union', function (err, database) {
  if (err) return console.log(err);

  db = database;
});

// ======================================
// private methods and functionalities
// ======================================

// get games list
function getGamesList() {
  return games;
}

// get game
function getGame(io, gameId) {
  var game = _.find(db.collection('games'), function (g) {
    return g.id === gameId;
  });

  return game[0];
}

// create game
// {
//   firstTeamCountry: 'England',
//   secondTeamCountry: 'Austria',
//   username: 'kim',
// }
function createGame(data) {
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
        country: data.firstTeamCountry,
        players: [],
        isBallHandler: false,
      },
      {
        id: secondTeamId,
        country: data.secondTeamCountry,
        players: [],
        isBallHandler: false,
      },
    ],
    status: gameStatus.pending,
    winningTeam: null,
    createdDate: new Date(),
    createdBy: data.username,
  };

  db.collection('games').save(game, (err, result) => {
    if (err) {
      return { error: 'game:join failed to create game. maybe your fault. we dont make mistakes you know' };
    }
    
    return result;
  });
}
// create game
// {
//   gameId: 'string',
//   teamId: 'string',
//   username: 'string',
//   avatarId: 'string'
// }
function joinGame(data) {
  if (!data || !data.gameId || !data.username || !data.avatarId || !data.teamId) {
    console.log('game:join invalid parameter');
    return { error: 'game:join invalid parameter' };
  }

  var game = _.find(db.collection('games'), function (g) {
    return g.id == data.gameId;
  });

  if (!game) {
    console.log('game:join game with id ' + data.gameId + ' cannot be found');
    return { error: 'game:join game with id ' + data.gameId + ' cannot be found' };
  }

  for (var t = 0; t < game.teams.length; t++) {
    if (game.teams[t].id === data.teamId) {
      var existingPlayer = _.find(game.teams[t].players, function (p) {
        return p.username === data.username;
      });

      if (existingPlayer.length > 0) {
        console.log('game:join failed as user ' + data.username + ' is already in team ' + game.teams[t].id);
        return { error: 'game:join failed as user ' + data.username + ' is already in team ' + game.teams[t].id };
      }

      game.teams[t].players.push({
        username: data.username,
      });
    } else {
      // if different team from request, we'll check if player exist from this team and remove user
      var existingPlayer = _.find(game.teams[t].players, function (p) {
        return p.username === data.username;
      });

      if (existingPlayer.length > 0) {
        var index = _.indexOf(game.teams[i].players, existingPlayer);
        game.teams[i].players.splice(index, 1);
      }
    }
  }

  db.collection('games').save(game, (err, result) => {
    if (err) {
      return { error: 'game:join failed to join user ' + data.username + ' due to unknown reasons. maybe your fault. we dont make mistakes you know' };
    }
    
    return result;
  });
}

function getCountries() {
  return db.collection('countries');
}

function getCountry(countryName) {
  var country = _.find(getCountries(), function (c) {
    return c.name === countryName;
  });

  return country[0];
}

module.exports = {
  createGame: createGame,
  getGamesList: getGamesList,
  getGame: getGame,
  joinGame: joinGame,
  getCountries: getCountries,
  getCountry: getCountry,
};