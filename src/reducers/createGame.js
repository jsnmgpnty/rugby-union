import {
  SET_TEAMS,
  SET_GAME_NAME,
  TOGGLE_TEAM_SPINNERS,
  START_GAME_SUCCESS,
  START_GAME_ERROR,
} from 'lib/actionNames';

const initialState = {
  teams: [],
  gameName: null,
  isTeamSpinnersVisible: false,
  startGameSuccess: false,
  startGameError: null,
};

const createGame = (state = initialState, action) => {
  switch (action.type) {
    case SET_TEAMS:
      return { ...state, teams: action.payload };
    case SET_GAME_NAME:
      return { ...state, gameName: action.payload };
    case TOGGLE_TEAM_SPINNERS:
      const isTeamSpinnersVisibleNewValue = !state.isTeamSpinnersVisible;
      return { ...state, isTeamSpinnersVisible: isTeamSpinnersVisibleNewValue };
    case START_GAME_SUCCESS:
      return { ...state, startGameSuccess: action.payload };
    case START_GAME_ERROR:
      return { ...state, startGameError: action.payload };
    default:
      return state;
  }
};

export default createGame;
