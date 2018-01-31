const BaseModel = require('./baseModel');

class User extends BaseModel {
  constructor(username) {
    super();

    this.username = username;
  }
}

module.exports = User;
