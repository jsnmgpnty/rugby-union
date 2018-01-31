const BaseModel = require('./baseModel');

class GameTurn extends BaseModel {
  constructor(turnId, ) {
    super();

    this.turnId = turnId;
    this.sender = sender;
    this.receiver = receiver;
  }
}