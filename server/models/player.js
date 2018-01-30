const BaseModel = require('./baseModel');

class Player extends BaseModel {
  constructor(playerId, name) {
    this.playerId = playerId;
    this.name = name;
  }
}

module.exports = Player;
