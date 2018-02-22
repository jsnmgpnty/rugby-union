import { SET_TEAMS, SET_GAME_NAME } from 'lib/actionNames';

const initialState = {
  teams: [],
  gameName: null,
};

const createGame = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEAMS:
      return { ...state, teams: action.payload };
    case SET_GAME_NAME:
      return { ...state, gameName: action.payload };
    default:
      return state;
  }
};

export default createGame;
