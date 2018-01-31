const uuid = require('uuid');
const _ = require('lodash');
const BaseService = require('./baseService');
const GameRepository = require('../database/gameRepository');
const CountryRepository = require('../database/countryRepository');
const Game = require('../models/game');
const Team = require('../models/team');
const User = require('../models/user');

const databaseCollections = {
  games: 'games',
  countries: 'countries',
};

const gameRepository = new GameRepository(databaseCollections.games);
const countryRepository = new CountryRepository(databaseCollections.countries);

// rugby game variables
const gameStatus = {
  inProgress: 'INPROGRESS',
  pending: 'PENDING',
  completed: 'COMPLETED',
};
const turnStatus = {
  voting: 'VOTING',
  passing: 'PASSING',
  completed: 'COMPLETED',
};

const isPlayerInTeam = (teams, username) => {
  const existingPlayer = _.find(team, function (t) {
    return t.username === username;
  });

  return existingPlayer && existingPlayer.length > 0;
};

const isPlayerPartOfGame = (game, username) => {
  const existingPlayer = _.find(game.players, function (t) {
    return t.username === username;
  });

  return existingPlayer && existingPlayer.length > 0;
}

const removePlayerFromTeams = (game, username) => {
  if (!game) return false;

  const player = _.find(game.players, (player) => { return player.username === username; })[0];
  if (player) {
    const playerIndex = _.indexOf(game.players, player);
    game.players.splice(playerIndex, 1);
  }

  game.teams.forEach((team) => {
    if (isPlayerInTeam(team, username)) {
      var index = _.indexOf(team, player);
      team.players.splice(index, 1);

      return;
    }
  });
};

const randomlyAssignPlayerToTeam = (game, username) => {
  const user = new User(username).toJson();

  if (game.teams[0].players.length > game.teams[1].players.length) {
    game.teams[0].players = [...game.teams[0].players, user];
  } else if (game.teams[1].players.length > game.teams[0].players.length) {
    game.teams[1].players = [...game.teams[1].players, user];
  } else {
    const randomIndex = (Math.floor(Math.random() * 2) + 1) - 1;
    game.teams[randomIndex].players = [...game.teams[randomIndex].players, user];
  }
};

class GameService extends BaseService {
  async getGamesList() {
    try {
      const result = await gameRepository.getList();
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  };

  async getGame(gameId) {
    try {
      var result = await gameRepository.getItem({ id: gameId });
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  };

  async createGame(data) {
    const gameId = uuid();
    const firstTeamId = uuid();
    const secondTeamId = uuid();
    const gameName = data.gameName || 'Game ' + gameId;

    const game = new Game({
      id: gameId,
      name: gameName,
      turns: [],
      players: [],
      teams: [
        new Team(firstTeamId, data.firstTeamCountry, [], false),
        new Team(secondTeamId, data.secondTeamCountry, [], false)
      ],
      status: gameStatus.pending,
      winningTeam: null,
      createdDate: new Date(),
      createdBy: data.username,
      modifiedDate: new Date(),
      modifiedBy: data.username,
    });

    try {
      const savedItem = await gameRepository.save(game);
      return savedItem;
    } catch (error) {
      return this.handleError(error);
    }
  };

  async joinGame(data) {
    if (!data || !data.gameId || !data.username) {
      console.log('game:join invalid parameter');
      return { error: 'game:join invalid parameter' };
    }

    let game = await this.getGame(data.gameId);
    if (!game || game.error) {
      console.log('game:join game with id ' + data.gameId + ' cannot be found');
      return { error: 'game:join game with id ' + data.gameId + ' cannot be found' };
    }

    if (!isPlayerPartOfGame(game, data.username)) {
      console.log('game:join user ' + data.username + ' is not part of the game yet');
      return { error: 'game:join user ' + data.username + ' is not part of the game yet' };
    }

    // remove player first from game and all teams in a game
    removePlayerFromTeams(game, data.username);

    if (!data.teamId) {
      randomlyAssignPlayerToTeam(game, data.username);
      return game;
    }

    const team = _.find(game.teams, (team) => { return team.teamId === data.teamId; })[0];
    if (!team) {
      console.log('game:join g with id ' + data.gameId + ' does not have a team ' + data.teamId);
      return { error: 'game:join g with id ' + data.gameId + ' does not have a team ' + data.teamId };
    }

    const isPlayerOnThisTeam = isPlayerInTeam(game.teams[t], data.username);
    if (isPlayerOnThisTeam) {
      console.log('game:join failed as user ' + data.username + ' is already in team ' + team.teamId);
      return { error: 'game:join failed as user ' + data.username + ' is already in team ' + team.teamId };
    }

    if (!isPlayerPartOfGame(game, username)) {
      game.players = [...game.players, new User(data.username).toJson()];
    }

    team.players = [...team.players, new User(data.username).toJson()];

    try {
      const savedItem = await gameRepository.save(game);
      return savedItem;
    } catch (error) {
      return this.handleError(error);
    }
  };

  async getCountries() {
    try {
      const countries = await countryRepository.getList();
      return countries;
    } catch (error) {
      return this.handleError(error);
    }
  };

  async getCountry(countryName) {
    try {
      const country = await countryRepository.getItem({ name: countryName });
      return country;
    } catch (error) {
      return this.handleError(error);
    }
  };
}

module.exports = GameService;