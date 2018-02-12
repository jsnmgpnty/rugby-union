import { SET_COUNTRIES } from 'lib/actionNames';

const initialState = {
  countries: [],
};

const countries = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNTRIES:
      return { ...state, countries: action.payload };
    default:
      return state;
  }
};

export default countries;
