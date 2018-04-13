import gameApi from 'services/GameApi';
import {
  SET_TEAMS,
  SET_GAME_NAME,
  TOGGLE_TEAM_SPINNERS,
  SET_GAME,
  IS_PAGE_LOADING,
  GO_TO_LOBBY,
  GO_TO_GAMEPREPARE,
  START_GAME_SUCCESS,
  START_GAME_ERROR,
} from 'lib/actionNames';

const setTeams = (payload) => ({ type: SET_TEAMS, payload });

const setGameName = (payload) => ({ type: SET_GAME_NAME, payload });

const setStartGameSuccess = (payload) => ({ type: START_GAME_SUCCESS, payload });

const setStartGameError = (payload) => ({ type: START_GAME_ERROR, payload });

const toggleTeamSpinners = (gameId, showTeamSpinners) => {
  return async (dispatch) => {
    const game = await gameApi.getGame(gameId);
    if (game) {
      dispatch({ type: SET_GAME, payload: game });
      dispatch({ type: TOGGLE_TEAM_SPINNERS, payload: showTeamSpinners });
    }
  };
};

const createGame = (gameName, userId, firstTeam, secondTeam) => {
  return async (dispatch) => {
    dispatch({ type: IS_PAGE_LOADING, payload: true });

    try {
      const result = await gameApi.createGame(gameName, userId, firstTeam, secondTeam);
      if (result && result.isSuccess) {
        dispatch({ type: SET_GAME, payload: result.data });
        dispatch({ type: GO_TO_GAMEPREPARE });
      }
      dispatch({ type: IS_PAGE_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: IS_PAGE_LOADING, payload: false });
    }
  };
};

const startGame = (gameId, firstTeam, secondTeam) => {
  return async (dispatch) => {
    dispatch({ type: IS_PAGE_LOADING, payload: true });

    try {
      const result = await gameApi.startGame(gameId, firstTeam, secondTeam);
      if (result && result.game) {
        dispatch({ type: SET_GAME, payload: result.game });
        dispatch(setStartGameSuccess(true));
      } else {
        dispatch(setStartGameError('Failed to start game'));
      }

      dispatch({ type: IS_PAGE_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: IS_PAGE_LOADING, payload: false });
    }
  };
};

const joinGame = (gameId, teamId, userId, avatarId) => {
  return async (dispatch) => {
    await gameApi.joinGame(gameId, teamId, userId, avatarId);
  };
};

const leaveGame = (gameId, teamId, userId) => {
  return async (dispatch) => {
    dispatch({ type: IS_PAGE_LOADING, payload: true });

    try {
      const result = await gameApi.leaveGame(gameId, teamId, userId);

      if (result && result.isSuccess) {
        dispatch({ type: GO_TO_LOBBY });
      }
      dispatch({ type: IS_PAGE_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: IS_PAGE_LOADING, payload: false });
    }
  };
};

export { setTeams, setGameName, toggleTeamSpinners, createGame, leaveGame, startGame, joinGame };
