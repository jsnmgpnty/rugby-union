const DbRepository = require('./dbRepository');

class CountryRepository extends DbRepository {
  constructor(collectionName) {
    super(collectionName);
  }
}

module.exports = CountryRepository;