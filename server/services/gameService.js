const uuid = require('uuid');
const _ = require('lodash');
const BaseService = require('./baseService');
const GameRepository = require('../database/gameRepository');
const CountryRepository = require('../database/countryRepository');
const Game = require('../models/game');
const Team = require('../models/team');
const User = require('../models/user');
const { countries } = require('../models/seedData');

const databaseCollections = {
  games: 'games',
  countries: 'countries',
};

const gameRepository = new GameRepository(databaseCollections.games);
const countryRepository = new CountryRepository(databaseCollections.countries);

// rugby game variables
const gameStatus = {
  inProgress: 'INPROGRESS',
  paused: 'PAUSED',
  pending: 'PENDING',
  completed: 'COMPLETED',
};
const turnStatus = {
  voting: 'VOTING',
  passing: 'PASSING',
  completed: 'COMPLETED',
};

const isPlayerInTeam = (team, username) => {
  if (!team.players || team.players.length === 0) {
    return false;
  }

  const existingPlayer = team.players.find((t) => {
    return t.username === username;
  });

  return !_.isNil(existingPlayer);
};

const isPlayerPartOfGame = (game, username) => {
  if (!game.players || game.players.length === 0) {
    return false;
  }

  const existingPlayer = game.players.find((t) => {
    return t.username === username;
  });

  return !_.isNil(existingPlayer);
}

const removePlayerFromTeams = (game, username) => {
  if (!game) return false;

  const player = game.players.find((player) => { return player.username === username; });
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
    return game.teams[0].teamId;
  } else if (game.teams[1].players.length > game.teams[0].players.length) {
    game.teams[1].players = [...game.teams[1].players, user];
    return game.teams[1].teamId;
  } else {
    const randomIndex = (Math.floor(Math.random() * 2) + 1) - 1;
    game.teams[randomIndex].players = [...game.teams[randomIndex].players, user];
    return game.teams[randomIndex].teamId;
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
      var result = await gameRepository.getItem({ gameId: gameId });
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  };

  // {
  //   username: string,
  //   firstTeamCountry: string,
  //   secondTeamCountry: string,
  // }
  async createGame(data) {
    const gameId = uuid();
    const firstTeamId = uuid();
    const secondTeamId = uuid();
    const gameName = data.gameName || 'Game ' + gameId;

    const game = new Game({
      gameId: gameId,
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
      const savedGame = await gameRepository.getItem({ gameId: gameId });
      return savedGame;
    } catch (error) {
      return this.handleError(error);
    }
  };

  // 

  // {
  //   username: string,
  //   gameId: string,
  //   teamId: string,
  //   avatarId: string,
  // }
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

    if (game.status !== gameStatus.pending) {
      console.log('game:join game with id ' + data.gameId + ' has already started');
      return { error: 'game:join game with id ' + data.gameId + ' has already started' };
    }

    // remove player first from game and all teams in a game
    removePlayerFromTeams(game, data.username);

    if (!data.teamId) {
      const teamId = randomlyAssignPlayerToTeam(game, data.username);
      return { gameId: game.gameId, teamId: teamId, username: data.username };
    }

    const team = game.teams.find((team) => { return team.teamId === data.teamId; });
    if (!team) {
      console.log('game:join game with id ' + data.gameId + ' does not have a team ' + data.teamId);
      return { error: 'game:join game with id ' + data.gameId + ' does not have a team ' + data.teamId };
    }

    const isPlayerOnThisTeam = isPlayerInTeam(team, data.username);
    if (isPlayerOnThisTeam) {
      console.log('game:join failed as user ' + data.username + ' is already in team ' + team.teamId);
      return { error: 'game:join failed as user ' + data.username + ' is already in team ' + team.teamId };
    }

    if (_.isNil(game.players)) {
      game.players = [];
    }

    if (!isPlayerPartOfGame(game, data.username)) {
      game.players.push(new User(data.username).toJson());
    }

    if (_.isNil(team.players)) {
      team.players = [];
    }

    team.players.push(new User(data.username).toJson());

    try {
      await gameRepository.save(game);
      const savedGame = await gameRepository.getItem({ gameId: data.gameId });
      return { gameId: savedGame.gameId, teamId: team.teamId, username: data.username };
    } catch (error) {
      return this.handleError(error);
    }
  };

  // {
  //   username: string,
  //   gameId: string,
  //   teamId: string,
  // }
  async leaveGame(data) {
    if (!data || !data.gameId || !data.username) {
      console.log('game:join invalid parameter');
      return { error: 'game:join invalid parameter' };
    }

    let game = await this.getGame(data.gameId);
    if (!game || game.error) {
      console.log('game:leave game with id ' + data.gameId + ' cannot be found');
      return { error: 'game:leave game with id ' + data.gameId + ' cannot be found' };
    }

    removePlayerFromTeams(game, data.username);

    try {
      await gameRepository.save(game);
      const savedGame = await gameRepository.getItem({ gameId: data.gameId });
      return { gameId: savedGame.gameId, teamId: team.teamId, username: data.username };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCountries() {
    try {
      // const countries = await countryRepository.getList();
      // return countries;
      return new Promise((resolve) => {
        resolve(countries);
      });
    } catch (error) {
      return this.handleError(error);
    }
  };

  async getCountry(countryName) {
    try {
      // const country = await countryRepository.getItem({ name: countryName });
      // return country;
      const country = countries.find((c) => c.name === countryName);
      return new Promise((resolve) => {
        resolve(country);
      });
    } catch (error) {
      return this.handleError(error);
    }
  };
}

module.exports = GameService;
