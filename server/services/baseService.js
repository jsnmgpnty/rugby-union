class BaseService {
  handleError(err) {
    return { error: err };
  }
}

module.exports = BaseService;