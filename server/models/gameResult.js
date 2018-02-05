const BaseModel = require('./baseModel');

class GameResult extends BaseModel {
  constructor(gameId, ballHandlerTeam, tacklingTeam, latestTurn, turnNumber) {
    super();

    this.gameId = gameId;
    this.ballHandlerTeam = ballHandlerTeam;
    this.tacklingTeam = tacklingTeam;
    this.latestTurn = latestTurn;
    this.turnNumber = turnNumber;
  }
}

module.exports = GameResult;
