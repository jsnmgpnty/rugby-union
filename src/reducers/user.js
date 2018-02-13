import { SET_USER, SET_CURRENT_TEAM } from 'lib/actionNames';

const initialState = {
  user: null,
  currentTeam: null,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_CURRENT_TEAM:
      return { ...state, currentTeam: action.payload };
    default:
      return state;
  }
};

export default user;
