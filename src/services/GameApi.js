import ApiClient from './ApiClient';
import { prod, local } from './ApiEnv';

const gameApiBaseUrl = window.appConfig.env === 'prod' ? prod.apiUrl : local.apiUrl;

class GameApi extends ApiClient {
  constructor() {
    super(gameApiBaseUrl);
  }

  async getGameState(gameId, userId) {
    return this.get(`/game/${gameId}/state?userId=${userId}`);
  }

  async getGames() {
    return this.get('/game?skip=0&take=9999');
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

  async getDepartments() {
    return this.get('/department');
  }

  async createGame(name, userId, firstTeamCountry, secondTeamCountry) {
    return this.post('/game', { name, userId, firstTeamCountry, secondTeamCountry });
  }

  async startGame(gameId) {
    return this.get(`/game/${gameId}/start`);
  }

  async joinGame(gameId, teamId, userId, playerId) {
    return this.get(`/game/${gameId}/join?teamId=${teamId}&userId=${userId}&playerId=${playerId}`);
  }

  async leaveGame(gameId, teamId, userId, playerId) {
    return this.get(`/game/${gameId}/leave?teamId=${teamId}&userId=${userId}&playerId=${playerId}`);
  }

  async passBall(gameId, sender, passTo) {
    return this.post(`/game/${gameId}/pass`, { gameId, sender, passTo });
  }

  async transitionGame(gameId) {
    return this.post(`/game/${gameId}/transition`, { gameId });
  }

  async tacklePlayer(gameId, sender, toTackle) {
    return this.post(`/game/${gameId}/tackle`, { gameId, sender, toTackle });
  }

  async login(username) {
    return this.post('/user/login', { username });
  }

  async getCountries() {
    return this.get('/country');
  }
}

export default new GameApi();
