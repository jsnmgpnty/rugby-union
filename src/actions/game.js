import gameApi from 'services/GameApi';
import { onGameStart } from 'services/SocketClient';
import {
  RESET_GAME_DETAILS,
  SET_PLAYER_TO_TACKLE,
  SET_PLAYER_TO_RECEIVE_BALL,
  SET_BALL_HANDLER,
  SET_BALL_HANDLER_TEAM,
  SET_TURN_NUMBER,
  SET_ROUND_NUMBER,
  SET_SCORES,
  SET_WINNING_TEAM,
  LOCK_TURN,
  UNLOCK_TURN,
  SET_GAME_STATUS,
  SET_GAME,
  GET_GAME_REQUEST_ERROR,
  GET_GAME_REQUEST_BUSY,
  SET_CURRENT_TEAM,
  GET_ACTIVE_GAMES_BUSY,
  GET_ACTIVE_GAMES_SUCCESS,
  GET_ACTIVE_GAMES_ERROR,
  GET_GAME_STATE_BUSY,
  GET_GAME_STATE_ERROR,
  SET_VOTES,
  SET_IS_PLAYER_ON_ATTACK,
  SET_ROUND_RESULTS,
  ADD_NEW_ACTIVE_GAME,
} from 'lib/actionNames';

const addNewActiveGame = payload => ({ type: ADD_NEW_ACTIVE_GAME, payload });

const setCurrentTeam = payload => ({ type: SET_CURRENT_TEAM, payload });

const setPlayerToTackle = (playerId) => ({ type: SET_PLAYER_TO_TACKLE, playerId });

const setPlayerToReceiveBall = (payload) => ({ type: SET_PLAYER_TO_RECEIVE_BALL, payload });

const setBallHandler = (isBallHandler, ballHandler) => ({ type: SET_BALL_HANDLER, isBallHandler, ballHandler });

const lockTurn = () => ({ type: LOCK_TURN });

const unlockTurn = () => ({ type: UNLOCK_TURN });

const setGameStatus = (status) => ({ type: SET_GAME_STATUS, status });

const resetGameDetails = () => ({ type: RESET_GAME_DETAILS });

const setVotes = (votes, userId) => {
  return (dispatch) => {
    if (userId && votes.some(v => v.sender === userId && v.toTackle)) {
      dispatch(lockTurn());
    }

    dispatch({ type: SET_VOTES, payload: votes });
  };
};

const setBallHandlerTeam = (ballHandlerTeam) => ({ type: SET_BALL_HANDLER_TEAM, payload: ballHandlerTeam });

const setTurnNumber = (turnNumber) => ({ type: SET_TURN_NUMBER, payload: turnNumber });

const setRoundNumber = (roundNumber) => ({ type: SET_ROUND_NUMBER, payload: roundNumber });

const setScores = (scores) => ({ type: SET_SCORES, payload: scores });

const setWinningTeam = (winningTeam) => ({ type: SET_WINNING_TEAM, payload: winningTeam });

const setIsPlayerOnAttack = (isPlayerOnAttack) => ({ type: SET_IS_PLAYER_ON_ATTACK, payload: isPlayerOnAttack });

const setRoundResults = (roundResults) => ({ type: SET_ROUND_RESULTS, payload: roundResults });

const setGame = (game) => ({ type: SET_GAME, payload: game });

const passBall = (gameId, userId, playerToReceiveBall) => {
  return async (dispatch) => {
    dispatch(lockTurn);
    await gameApi.passBall(gameId, userId, playerToReceiveBall);
  };
};

const tacklePlayer = (gameId, userId, playerToTackle) => {
  return async (dispatch) => {
    dispatch(lockTurn);
    await gameApi.tacklePlayer(gameId, userId, playerToTackle);
  };
};

const transitionGame = (gameId) => {
  return async (dispatch) => {
    await gameApi.transitionGame(gameId);
  };
};

const getGame = (gameId) => {
  return async (dispatch) => {
    dispatch({ type: GET_GAME_REQUEST_BUSY, payload: true });

    try {
      const game = await gameApi.getGame(gameId);
      if (game) {
        dispatch(setGame(game));
      }

      dispatch({ type: GET_GAME_REQUEST_BUSY, payload: false });
    } catch (error) {
      dispatch({ type: GET_GAME_REQUEST_ERROR, payload: error });
      dispatch({ type: GET_GAME_REQUEST_BUSY, payload: false });
    }
  };
};

const getActiveGames = () => {
  return async (dispatch) => {
    dispatch({ type: GET_ACTIVE_GAMES_BUSY, payload: true });

    try {
      const games = await gameApi.getGames();

      dispatch({ type: GET_ACTIVE_GAMES_SUCCESS, payload: games });
      dispatch({ type: GET_ACTIVE_GAMES_BUSY, payload: false });
    } catch (error) {
      dispatch({ type: GET_ACTIVE_GAMES_ERROR, getActiveGamesError: error });
      dispatch({ type: GET_ACTIVE_GAMES_BUSY, payload: false });
    }
  }
};

const getLatestGameByUser = (userId) => {
  return async (dispatch) => {
    const game = await gameApi.getLatestGameByUser(userId);
    if (game && game.gameId) {
      dispatch(setGame(game));
    }
  };
};

const getGameState = (gameId, userId) => {
  return async (dispatch) => {
    dispatch({ type: GET_GAME_STATE_BUSY, payload: true });

    try {
      const gameStateResult = await gameApi.getGameState(gameId, userId);

      if (gameStateResult) {
        dispatch(setGame(gameStateResult));
        dispatch(setGameStatus(gameStateResult.gameStatus));

        if (gameStateResult.teamId) {
          const currentTeam = gameStateResult.teams.find(a => a.teamId === gameStateResult.teamId);
          const ballHandlerTeam = gameStateResult.teams.find(a => a.isBallHandler);
          const isPlayerOnAttack = currentTeam.isBallHandler;

          if (isPlayerOnAttack) {
            const ballHolder = gameStateResult.latestTurn[0].sender;
            const ballReceiver = gameStateResult.latestTurn[0].passedTo;

            if (ballReceiver) {
              dispatch(lockTurn());
            } else {
              dispatch(unlockTurn());
            }

            dispatch(setBallHandler(true, ballHolder));
            dispatch(setPlayerToReceiveBall(ballReceiver));
          } else {
            dispatch(unlockTurn());
            dispatch(setBallHandler(false, null));
            dispatch(setVotes(gameStateResult.latestTurn, userId));
          }

          dispatch(setIsPlayerOnAttack(isPlayerOnAttack));
          dispatch(setBallHandlerTeam(ballHandlerTeam));
          dispatch(setTurnNumber(gameStateResult.turnNumber));
          dispatch(setRoundNumber(gameStateResult.roundNumber));
          dispatch(setBallHandlerTeam(ballHandlerTeam));
          dispatch(setCurrentTeam(currentTeam));

          onGameStart({ userId, teamId: currentTeam.teamId });
        }

        if (gameStateResult.scores) {
          dispatch(setScores(gameStateResult.scores));
        }

        if (gameStateResult.winningTeam) {
          dispatch(setWinningTeam(gameStateResult.winningTeam));
        }
      }

      dispatch({ type: GET_GAME_STATE_BUSY, payload: false });
    } catch (error) {
      dispatch({ type: GET_GAME_STATE_ERROR, getGameStateError: error });
      dispatch({ type: GET_GAME_STATE_BUSY, payload: false });
    }
  };
};

export {
  addNewActiveGame,
  resetGameDetails,
  setCurrentTeam,
  setPlayerToTackle,
  setPlayerToReceiveBall,
  setBallHandler,
  lockTurn,
  unlockTurn,
  setGameStatus,
  getGame,
  setGame,
  tacklePlayer,
  passBall,
  transitionGame,
  getActiveGames,
  getLatestGameByUser,
  getGameState,
  setBallHandlerTeam,
  setTurnNumber,
  setRoundNumber,
  setScores,
  setWinningTeam,
  setVotes,
  setRoundResults,
  setIsPlayerOnAttack,
};
