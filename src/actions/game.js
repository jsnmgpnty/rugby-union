import {
  SET_PLAYER_TO_TACKLE,
  SET_PLAYER_TO_RECEIVE_BALL,
  IS_BALL_HANDLER,
  LOCK_TURN,
  UNLOCK_TURN,
} from 'lib/actionNames';

const setPlayerToTackle = (playerId) => ({ type: SET_PLAYER_TO_TACKLE, playerId });

const setPlayerToReceiveBall = (payload) => ({ type: SET_PLAYER_TO_RECEIVE_BALL, payload });

const isBallHandler = (payload) => ({ type: IS_BALL_HANDLER, payload });

const lockTurn = () => ({ type: LOCK_TURN });

const unlockTurn = () => ({ type: UNLOCK_TURN });

export {
  setPlayerToTackle,
  setPlayerToReceiveBall,
  isBallHandler,
  lockTurn,
  unlockTurn,
};
