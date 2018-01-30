const BaseModel = require('./baseModel');

class User extends BaseModel {
  constructor(userId, username) {
    this.userId = userId;
    this.username = username;
  }
}

module.exports = User;
