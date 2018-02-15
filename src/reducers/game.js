import {
  SET_PLAYER_TO_TACKLE,
} from 'lib/actionNames';

const initialState = {
  playerToTackle: null,
};

export default function game(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYER_TO_TACKLE:
      return {
        ...state,
        playerToTackle: action.playerId
      };
    default:
      return state;
  }
}
