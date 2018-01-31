const BaseModel = require('./baseModel');

class Country extends BaseModel {
  constructor(countryId, name, players) {
    super();

    this.countryId = countryId;
    this.name = name;
    this.players = players;
  }
}

module.exports = Country;
