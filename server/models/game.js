const BaseModel = require('./baseModel');

class Game extends BaseModel {
  constructor(model) {
    this.gameId = model.gameId;
    this.name = model.name;
    this.turns = model.turns;
    this.players = model.players;
    this.teams = model.teams;
    this.status = model.status;
    this.createdDate = model.createdDate;
    this.createdBy = model.createdBy;
    this.modifiedDate = model.modifiedDate;
    this.modifiedBy = model.modifiedBy;
    this.winningTeam = model.winningTeam;
  }
}

module.exports = Game;