const BaseModel = require('./baseModel');

class Player extends BaseModel {
  constructor(playerId, name) {
    super();

    this.playerId = playerId;
    this.name = name;
  }
}

module.exports = Player;
