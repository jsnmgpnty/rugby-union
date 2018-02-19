import {
  SET_PLAYER_TO_TACKLE,
  SET_PLAYER_TO_RECEIVE_BALL,
  SET_BALL_HANDLER,
  LOCK_TURN,
  UNLOCK_TURN,
  SET_GAME_STATUS,
} from 'lib/actionNames';

const initialState = {
  playerToTackle: null,
  playerToReceiveBall: null,
  isBallHandler: false,
  ballHandler: null,
  turnLocked: false,
  status: null,
};

export default function game(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYER_TO_TACKLE:
      return {
        ...state,
        playerToTackle: action.playerId,
      };
    case SET_PLAYER_TO_RECEIVE_BALL:
      return {
        ...state,
        playerToReceiveBall: action.payload,
      };
    case SET_BALL_HANDLER:
      return {
        ...state,
        isBallHandler: action.isBallHandler,
        ballHandler: action.ballHandler,
      };
    case LOCK_TURN:
      return {
        ...state,
        turnLocked: true,
      };
    case UNLOCK_TURN:
      return {
        ...state,
        turnLocked: false,
      };
    case SET_GAME_STATUS:
      return {
        ...state,
        status: action.status,
      };
    default:
      return state;
  }
}
