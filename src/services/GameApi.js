import ApiClient from './ApiClient';

const gameApiBaseUrl = 'http://localhost:8080/api';

class GameApi extends ApiClient {
  constructor() {
    super(gameApiBaseUrl);
  }

  async getGames() {
    return this.get('/game/active');
  }

  async getGame(gameId) {
    return this.get(`/game/${gameId}`);
  }

  async getGamesByUser(username) {
    return this.get(`/user/${username}/game/all`);
  }

  async getLatestGameByUser(username) {
    return this.get(`/user/${username}/game/latest`);
  }
}

export default new GameApi();
