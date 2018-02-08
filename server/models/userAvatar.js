const BaseModel = require('./baseModel');

class UserAvatar extends BaseModel {
  constructor(username, avatarId) {
    super();

    this.username = username;
    this.avatarId = avatarId;
  }
}

module.exports = UserAvatar;
