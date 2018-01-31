const BaseModel = require('./baseModel');

class Team extends BaseModel  {
  constructor(teamId, countryId, users, isBallHandler) {
    super();

    this.teamId = teamId;
    this.countryId = countryId;
    this.users = users;
    this.isBallHandler = isBallHandler;
  }
}

module.exports = Team;
