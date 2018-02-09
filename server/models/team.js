const BaseModel = require('./baseModel');

class Team extends BaseModel  {
  constructor(teamId, countryId, players, isBallHandler) {
    super();

    this.teamId = teamId;
    this.countryId = countryId;
    this.players = players;
    this.isBallHandler = isBallHandler;
  }
}

module.exports = Team;
