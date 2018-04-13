import {
  SET_USER,
  LOGIN_ERROR,
  LOGIN_BUSY,
} from 'lib/actionNames';

const initialState = {
  user: null,
  loginError: null,
  isLoginBusy: false,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case LOGIN_BUSY:
      return { ...state, isLoginBusy: action.payload };
    case LOGIN_ERROR:
      return { ...state, loginError: action.payload };
    default:
      return state;
  }
};

export default user;
