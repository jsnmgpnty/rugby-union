import { SET_TEAMS } from 'lib/actionNames';

const initialState = {
  teams: [],
};

const createGame = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEAMS:
      return { ...state, teams: action.payload };
    default:
      return state;
  }
};

export default createGame;
