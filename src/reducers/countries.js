import { SET_COUNTRIES } from 'lib/actionNames';

const initialState = {
  countries: [],
};

const countries = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNTRIES:
      return { ...state, ...action.countries };
    default:
      return state;
  }
};

export default countries;
