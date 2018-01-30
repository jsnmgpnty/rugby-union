const DbRepository = require('./dbRepository');

class GameRepository extends DbRepository {
  constructor(collectionName) {
    super(collectionName);
  }
}

module.exports = GameRepository;
