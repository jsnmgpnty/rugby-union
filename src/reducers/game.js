import {
  SET_PLAYER_TO_TACKLE,
  SET_PLAYER_TO_RECEIVE_BALL,
  IS_BALL_HANDLER,
  LOCK_TURN,
  UNLOCK_TURN,
} from 'lib/actionNames';

const initialState = {
  playerToTackle: null,
  playerToReceiveBall: null,
  isBallHandler: false,
  turnLocked: false,
};

export default function game(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYER_TO_TACKLE:
      return {
        ...state,
        playerToTackle: action.playerId
      };
    case SET_PLAYER_TO_RECEIVE_BALL:
      return {
        ...state,
        playerToReceiveBall: action.payload,
      };
    case IS_BALL_HANDLER:
      return {
        ...state,
        isBallHandler: action.payload,
      };
    case LOCK_TURN:
      return {
        ...state,
        turnLocked: true
      };
    case UNLOCK_TURN:
      return {
        ...state,
        turnLocked: false
      };
    default:
      return state;
  }
}
