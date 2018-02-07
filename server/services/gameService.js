const uuid = require('uuid');
const _ = require('lodash');
const BaseService = require('./baseService');
const GameRepository = require('../database/gameRepository');
const CountryRepository = require('../database/countryRepository');
const Game = require('../models/game');
const Team = require('../models/team');
const User = require('../models/user');
const UserAvatar = require('../models/userAvatar');
const GameResult = require('../models/gameResult');
const turnStatus = require('../models/turnStatusEnum');
const gameStatus = require('../models/gameStatusEnum');
const { countries } = require('../models/seedData');

const maxGameTurnsToResult = 6;
const allowableGuessDivisor = 2;

const databaseCollections = {
  games: 'games',
  countries: 'countries',
};

const gameRepository = new GameRepository(databaseCollections.games);
const countryRepository = new CountryRepository(databaseCollections.countries);

// rugby game variables

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
  // status : gameStatus ['INPROGRESS', 'PENDING', 'PAUSED', 'COMPLETED']
  // get games list
  async getGamesList(status) {
    try {
      const result = status ?
        await gameRepository.getList() :
        await gameRepository.getFilteredList({ status });

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  };

  async getActiveList() {
    try {
      const result = await gameRepository.getList();
      return result.filter((r) => r.status !== gameStatus.completed);
    } catch (error) {
      return this.handleError(error);
    }
  };

  // gameId : string
  // get full game details by id
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
      game.players.push(new UserAvatar(data.username, data.avatarId).toJson());
    }

    if (_.isNil(team.players)) {
      team.players = [];
    }

    team.players.push(new UserAvatar(data.username, data.avatarId).toJson());

    try {
      await gameRepository.save(game);
      const savedGame = await gameRepository.getItem({ gameId: data.gameId });
      return { gameId: savedGame.gameId, teamId: team.teamId, username: data.username, avatarId: data.avatarId };
    } catch (error) {
      return this.handleError(error);
    }
  };

  // {
  //   gameId: string,
  // }
  async startGame(data) {
    if (!data || !data.gameId) {
      console.log('game:start invalid parameter');
      return { error: 'game:start invalid parameter' };
    }

    let game = await this.getGame(data.gameId);
    if (!game || game.error) {
      console.log('game:start game with id ' + data.gameId + ' cannot be found');
      return { error: 'game:start game with id ' + data.gameId + ' cannot be found' };
    }

    game.status = gameStatus.inProgress;

    if (!game.turns) {
      game.turns = [];
    }

    game.turns.push({
      ballHandler: { sentBy: null, passedTo: null },
      tacklers: [],
      status: turnStatus.passing,
      sortOrder: game.turns.length + 1,
    });

    // randomize who ball handler is
    const randomIndex = (Math.floor(Math.random() * 2) + 1) - 1;
    game.teams[randomIndex].isBallHandler = true;

    const latestTurn = game.turns[game.turns.length - 1];
    const ballHandlerTeam = game.teams.find(a => a.isBallHandler === true);
    const tacklingTeam = game.teams.find(a => a.isBallHandler === false);

    try {
      await gameRepository.save(game);
      const savedGame = await gameRepository.getItem({ gameId: data.gameId });
      return new GameResult(savedGame.gameId, ballHandlerTeam.teamId, tacklingTeam.teamId, savedGame.turns[savedGame.turns.length - 1], savedGame.turns.length).toJson();
    } catch (error) {
      return this.handleError(error);
    }
  }

  // {
  //   username: string,
  //   ballHandler: string,
  //   gameId: string,
  // }
  async guessBallHandler(data) {
    if (!data || !data.gameId || !data.username || data.ballHandler) {
      console.log('game:guess:ball invalid parameter');
      return { error: 'game:guess:ball invalid parameter' };
    }

    let game = await this.getGame(data.gameId);
    if (!game || game.error) {
      console.log('game:guess:ball game with id ' + data.gameId + ' cannot be found');
      return { error: 'game:guess:ball game with id ' + data.gameId + ' cannot be found' };
    }

    if (game.status !== gameStatus.inProgress) {
      console.log('game:guess:ball game with id ' + data.gameId + ' is not running');
      return { error: 'game:guess:ball game with id ' + data.gameId + ' is not running' };
    }

    const latestTurn = game.turns[game.turns.length - 1];
    if (!latestTurn) {
      console.log('game:guess:ball invalid turn');
      return { error: 'game:guess:ball invalid turn' };
    }

    if (!latestTurn.tacklers) {
      latestTurn.tacklers = [];
      latestTurn.tacklers.push({
        sentBy: data.username,
        guessedBallHandler: data.ballHandler,
        createdDateTime: new Date(),
      });
    } else {
      const existingPlayer = latestTurn.tacklers.find((t) => {
        return t.sentBy === data.username;
      });

      if (_.isNil(existingPlayer)) {
        latestTurn.tacklers.push({
          sentBy: data.username,
          guessedBallHandler: data.ballHandler,
          createdDateTime: new Date(),
        });
      } else {
        for (let i = 0; i < latestTurn.tacklers.length; i++) {
          if (latestTurn.tacklers[i].sentBy === data.username) {
            latestTurn.tacklers[i].guessedBallHandler = data.ballHandler;
            latestTurn.tacklers[i].createdDateTime = new Date();
            break;
          }
        }
      }
    }

    const ballHandlerTeam = game.teams.find(a => a.isBallHandler === true);
    const tacklingTeam = game.teams.find(a => a.isBallHandler === false);

    try {
      await gameRepository.save(game);
      const savedGame = await gameRepository.getItem({ gameId: data.gameId });
      return new GameResult(savedGame.gameId, ballHandlerTeam.teamId, tacklingTeam.teamId, savedGame.turns[savedGame.turns.length - 1], savedGame.turns.length).toJson();
    } catch (error) {
      return this.handleError(error);
    }
  }

  // {
  //   username: string,
  //   passTo: string,
  //   gameId: string,
  // }
  async passBall(data) {
    if (!data || !data.gameId || !data.username || data.passTo) {
      console.log('game:guess:ball invalid parameter');
      return { error: 'game:guess:ball invalid parameter' };
    }

    let game = await this.getGame(data.gameId);
    if (!game || game.error) {
      console.log('game:guess:ball game with id ' + data.gameId + ' cannot be found');
      return { error: 'game:guess:ball game with id ' + data.gameId + ' cannot be found' };
    }

    if (game.status !== gameStatus.inProgress) {
      console.log('game:guess:ball game with id ' + data.gameId + ' is not running');
      return { error: 'game:guess:ball game with id ' + data.gameId + ' is not running' };
    }

    const latestTurn = game.turns[game.turns.length - 1];
    if (!latestTurn) {
      console.log('game:guess:ball invalid turn');
      return { error: 'game:guess:ball invalid turn' };
    }

    if (!latestTurn.ballHandler) {
      latestTurn.ballHandler = {
        sentBy: data.username,
        passedTo: data.passTo,
      };
    } else {
      if (latestTurn.ballHandler.sentBy !== data.username) {
        console.log('game:guess:ball you are not holding the ball. dafuq u cheating');
        return { error: 'game:guess:ball you are not holding the ball. dafuq u cheating' };
      } else {
        latestTurn.ballHandler.sentBy = data.username;
        receivedBy.ballHandler.passedTo = data.passTo;
      }
    }

    latestTurn.status = turnStatus.voting;

    const ballHandlerTeam = game.teams.find(a => a.isBallHandler === true);
    const tacklingTeam = game.teams.find(a => a.isBallHandler === false);

    try {
      await gameRepository.save(game);
      const savedGame = await gameRepository.getItem({ gameId: data.gameId });
      return new GameResult(savedGame.gameId, ballHandlerTeam.teamId, tacklingTeam.teamId, savedGame.turns[savedGame.turns.length - 1], savedGame.turns.length).toJson();
    } catch (error) {
      return this.handleError(error);
    }
  }

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

  // gameId: string
  async evaluateGameResult(gameId) {
    if (!data || !data.gameId) {
      console.log('game:result:evaluate invalid parameter');
      return { error: 'game:result:evaluate invalid parameter' };
    }

    let game = await this.getGame(data.gameId);
    if (!game || game.error) {
      console.log('game:result:evaluate game with id ' + data.gameId + ' cannot be found');
      return { error: 'game:result:evaluate game with id ' + data.gameId + ' cannot be found' };
    }

    if (game.status !== gameStatus.inProgress) {
      console.log('game:result:evaluate game with id ' + data.gameId + ' is not running');
      return { error: 'game:result:evaluate game with id ' + data.gameId + ' is not running' };
    }

    const latestTurn = game.turns[game.turns.length - 1];
    if (!latestTurn) {
      console.log('game:guess:ball invalid turn');
      return { error: 'game:guess:ball invalid turn' };
    }

    const ballHandlerTeam = game.teams.find(a => a.isBallHandler === true);
    const tacklingTeam = game.teams.find(a => a.isBallHandler === false);

    // count number of players in the voting team so we can get number of allowable guesses they have
    const votingTeamPlayerCount = tacklingTeam.players.length;
    const numberOfAllowableGuesses = Math.floor(votingTeamPlayerCount / allowableGuessDivisor);

    // get total number of voters and add 1 to count the ball passer
    const votersCount = votingTeamPlayerCount + 1;

    // get total number of actual voters in the turn and add 1 to count ball passer if any
    const numberOfPlayersWhoVoted = latestTurn.tacklers.length + (latestTurn.ballHandler.passedTo ? 1 : 0);

    // if total voters equals the number of players in game
    // it means we need to evaluate result
    if (numberOfPlayersWhoVoted === votersCount) {
      // lets group and order the votes by the selected user the team voted for
      const groupedByVote = _.groupBy(latestTurn.tacklers, (tackler) => {
        return tackler.guessedBallHandler;
      });
      const orderedVotes = _.orderBy(groupedByVote, (tackler) => {
        return tackler.length;
      }, 'desc');
      const getTopVotedUsers = orderedVotes.slice(0, numberOfAllowableGuesses);

      const usersList = getTopVotedUsers.map((votedUsers) => {
        return _.uniq(_.map(votedUsers, function (a) {
          return a.guessedBallHandler;
        }))[0];
      });

      let winningTeam = null;
      let isTouchdown = false;
      let isTackled = false;

      // THE MOMENT OF TRUTH 
      // we check if the voted users match with the ball handler
      if (usersList.includes(latestTurn.ballHandler.passedTo)) {
        // ball handler has been guessed. game is over yo!
        game.status = gameStatus.completed;
        winningTeam = tacklingTeam;
        isTackled = true;
      } else {
        // ball handler survived. 
        // let's check if ball handler touched down or not
        if (game.turns.length >= maxGameTurnsToResult) {
          // ball handler has touched down
          game.status = gameStatus.completed;
          winningTeam = ballHandlerTeam;
          isTouchdown = true;
        } else {
          winningTeam = null;
          game.status = gameStatus.inProgress;
          game.turns.push
        }
      }

      // regardless of the turn outcome, we set the latest turn to completed
      latestTurn.status = turnStatus.completed;
      
      // add a new turn to initialize next round
      game.turns.push({
        ballHandler: { sentBy: null, passedTo: null },
        tacklers: [],
        status: turnStatus.passing,
        sortOrder: game.turns.length + 1,
      });
    }

    try {
      await gameRepository.save(game);
      const savedGame = await gameRepository.getItem({ gameId: data.gameId });

      if (game.status === gameStatus.completed) {
        return {
          gameId: savedGame.gameId, 
          status: game.status,
          ballHandlerTeam: ballHandlerTeam.teamId,
          tacklingTeam: tacklingTeam.teamId,
          totalTurns: savedGame.turns.length,
          isTackled,
          isTouchdown,
          winningTeam
        };
      }

      return new GameResult(
        savedGame.gameId,
        ballHandlerTeam.teamId,
        tacklingTeam.teamId,
        savedGame.turns[savedGame.turns.length - 1],
        savedGame.turns.length
      ).toJson();
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
