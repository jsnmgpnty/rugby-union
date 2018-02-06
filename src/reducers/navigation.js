import { IS_CREATING_GAME, IS_GAME_CREATED, SET_CURRENT_PAGE } from 'lib/actionNames';

const initialState = {
  isCreatingPage: false,
  isGameCreated: false,
  currentPage: null,
};

const navigation = (state = initialState, action) => {
  switch (action.type) {
    case IS_CREATING_GAME:
      return { ...state, isCreatingPage: action.payload };
    case IS_GAME_CREATED:
      return { ...state, isGameCreated: action.payload };
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
};

export default countries;
