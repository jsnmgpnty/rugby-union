import ApiClient from './ApiClient';
import { prod, local } from './ApiEnv';

const gameApiBaseUrl = window.appConfig.env === 'prod' ? prod.apiUrl : local.apiUrl;

class GameApi extends ApiClient {
  constructor() {
    super(gameApiBaseUrl);
  }

  async getGameState(gameId, userId) {
    return new Promise((resolve) => {
      resolve({
        "isSuccess": true,
        "errorCode": 0,
        "message": null,
        "data": {
          "gameId": "465f5716-d5ce-4019-978d-dfe1460cd5c8",
          "ballHandlerTeam": "2fac0404-7ca6-494f-adbc-7f3e78fb8583",
          "tacklingTeam": "0ceb58f4-05b1-4698-8554-a7d1203443dd",
          "latestTurn": {
            "turnId": "63ec2577-be65-45c7-9171-85a717313f00",
            "ballHandler": null,
            "tacklers": null,
            "sortOrder": 1
          },
          "turnNumber": 1,
          "teamId": "0ceb58f4-05b1-4698-8554-a7d1203443dd",
          "userId": "8ed88a5f-170d-4b47-aa5d-8a909a56ba4f"
        }
      });
    });
  }

  async getGames() {
    return this.get('/game?skip=0&take=9999');
  }

  async getGame(gameId) {
    return new Promise((resolve) => {
      resolve({
        "gameId": "465f5716-d5ce-4019-978d-dfe1460cd5c8",
        "name": "Game 465f5716-d5ce-4019-978d-dfe1460cd5c8",
        "gameStatus": 1,
        "turns": [
          {
            "turnId": "63ec2577-be65-45c7-9171-85a717313f00",
            "ballHandler": null,
            "tacklers": null,
            "sortOrder": 1
          }
        ],
        "teams": [
          {
            "teamId": "0ceb58f4-05b1-4698-8554-a7d1203443dd",
            "countryId": "d0dc1ee0-8597-4d07-ae14-6096c803c655",
            "users": [
              {
                "userId": "458429cd-5914-4ed9-9f41-b4a3c7fe7441",
                "username": "test002",
                "playerId": "116fdea3-1893-4897-af15-450189215d8f"
              },
              {
                "userId": "2efcfc85-2401-463a-89b0-9d9f1d1877f5",
                "username": "test003",
                "playerId": "35bfe4c8-e6da-49ee-97b5-f7baa416557f"
              },
              {
                "userId": "c45a9131-6850-4343-834e-9f6cfe2c1db4",
                "username": "test004",
                "playerId": "b728dec0-cf3d-4b8b-9700-50714d511d62"
              },
              {
                "userId": "5c1fb4b1-8f70-40a9-8da9-96c223229d56",
                "username": "test005",
                "playerId": "46b8d889-d6a4-4171-82e3-378122f9df24"
              },
              {
                "userId": "8ed88a5f-170d-4b47-aa5d-8a909a56ba4f",
                "username": "test001",
                "playerId": "e45da573-9449-4709-a097-0fc7fcf0cb97"
              }
            ],
            "isBallHandler": false
          },
          {
            "teamId": "2fac0404-7ca6-494f-adbc-7f3e78fb8583",
            "countryId": "0be94155-2a92-448d-83b1-13777e84ac0c",
            "users": [
              {
                "userId": "c9c160e1-aa43-4266-9332-47c72e3775c9",
                "username": "test006",
                "playerId": "3fbe7a13-459a-41ab-a5f4-0fbf54e523af"
              },
              {
                "userId": "15212ff3-1d04-4d23-bbea-95317ebf83bb",
                "username": "test007",
                "playerId": "017673b8-aa71-44a8-9c32-02c5dcd1823d"
              },
              {
                "userId": "23fcbe98-bebf-45ff-9258-eb3db0179d9b",
                "username": "test008",
                "playerId": "45ce2091-b690-4a52-bdd9-7974adfde671"
              },
              {
                "userId": "4209ceb1-3329-47c9-b348-f77111a41ce1",
                "username": "test009",
                "playerId": "8d9b48ac-9564-44a9-bd0a-1af58b710717"
              },
              {
                "userId": "d4946c68-8627-4cdf-930f-38e451387496",
                "username": "test010",
                "playerId": "8d0006df-f426-4602-b03e-fafea7740a9e"
              }
            ],
            "isBallHandler": true
          }
        ],
        "players": [
          {
            "userId": "458429cd-5914-4ed9-9f41-b4a3c7fe7441",
            "username": "test002",
            "playerId": "116fdea3-1893-4897-af15-450189215d8f"
          },
          {
            "userId": "2efcfc85-2401-463a-89b0-9d9f1d1877f5",
            "username": "test003",
            "playerId": "35bfe4c8-e6da-49ee-97b5-f7baa416557f"
          },
          {
            "userId": "c45a9131-6850-4343-834e-9f6cfe2c1db4",
            "username": "test004",
            "playerId": "b728dec0-cf3d-4b8b-9700-50714d511d62"
          },
          {
            "userId": "5c1fb4b1-8f70-40a9-8da9-96c223229d56",
            "username": "test005",
            "playerId": "46b8d889-d6a4-4171-82e3-378122f9df24"
          },
          {
            "userId": "c9c160e1-aa43-4266-9332-47c72e3775c9",
            "username": "test006",
            "playerId": "3fbe7a13-459a-41ab-a5f4-0fbf54e523af"
          },
          {
            "userId": "15212ff3-1d04-4d23-bbea-95317ebf83bb",
            "username": "test007",
            "playerId": "017673b8-aa71-44a8-9c32-02c5dcd1823d"
          },
          {
            "userId": "23fcbe98-bebf-45ff-9258-eb3db0179d9b",
            "username": "test008",
            "playerId": "45ce2091-b690-4a52-bdd9-7974adfde671"
          },
          {
            "userId": "4209ceb1-3329-47c9-b348-f77111a41ce1",
            "username": "test009",
            "playerId": "8d9b48ac-9564-44a9-bd0a-1af58b710717"
          },
          {
            "userId": "d4946c68-8627-4cdf-930f-38e451387496",
            "username": "test010",
            "playerId": "8d0006df-f426-4602-b03e-fafea7740a9e"
          },
          {
            "userId": "8ed88a5f-170d-4b47-aa5d-8a909a56ba4f",
            "username": "test001",
            "playerId": "e45da573-9449-4709-a097-0fc7fcf0cb97"
          }
        ],
        "winningTeam": null,
        "id": {
          "timestamp": 1518570571,
          "machine": 2957453,
          "pid": 20684,
          "increment": 5512686,
          "creationTime": "2018-02-14T01:09:31Z"
        },
        "createdDate": "2018-02-14T01:09:31.683Z",
        "createdBy": "8ed88a5f-170d-4b47-aa5d-8a909a56ba4f",
        "modifiedDate": "2018-02-14T07:22:51.739Z",
        "modifiedBy": "8ed88a5f-170d-4b47-aa5d-8a909a56ba4f"
      });
    });
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
