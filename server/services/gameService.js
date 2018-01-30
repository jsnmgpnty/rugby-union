const uuid = require('uuid');
const _ = require('lodash');
const BaseService = require('./baseService');
const GameRepository = require('../database/gameRepository');
const CountryRepository = require('../database/countryRepository');

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

  async createGame (data) {
    const gameId = uuid();
    const firstTeamId = uuid();
    const secondTeamId = uuid();
    const gameName = data.gameName || 'Game ' + gameId;

    const game = {
      id: gameId,
      name: gameName,
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

    try {
      const savedItem = await gameRepository.save(game);
      return savedItem;
    } catch (error) {
      return this.handleError(error);
    }
  };

  async joinGame(data) {
    if (!data || !data.gameId || !data.username || !data.avatarId || !data.teamId) {
      console.log('game:join invalid parameter');
      return { error: 'game:join invalid parameter' };
    }

    let game = await this.getGame(data.gameId);
    if (!game || game.error) {
      console.log('game:join game with id ' + data.gameId + ' cannot be found');
      return { error: 'game:join game with id ' + data.gameId + ' cannot be found' };
    }

    for (let t = 0; t < game.teams.length; t++) {
      if (game.teams[t].id === data.teamId) {
        let existingPlayer = _.find(game.teams[t].players, function (p) {
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