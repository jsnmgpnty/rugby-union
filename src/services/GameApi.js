import ApiClient from './ApiClient';

const gameApiBaseUrl = 'http://localhost:8080/api';

class GameApi extends ApiClient {
  constructor() {
    super(gameApiBaseUrl);
  }

  async getGames() {
    return this.get('/game');
  }

  async getGame(gameId) {
    return this.get(`/game/${gameId}`);
  }
}

export default new GameApi();
