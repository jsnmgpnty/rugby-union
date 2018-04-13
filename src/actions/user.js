import { reactLocalStorage } from 'reactjs-localstorage';
import gameApi from 'services/GameApi';
import { initializeSession } from 'services/SocketClient';
import {
  SET_USER,
  LOGIN_ERROR,
  LOGIN_BUSY,
} from 'lib/actionNames';

const setUser = user => ({ type: SET_USER, payload: user });

const login = (username) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_BUSY, payload: true });

    try {
      const result = await gameApi.login(username);
      if (result) {
        if (!result.isSuccess) {
          dispatch({ type: LOGIN_ERROR, payload: result.message });
        }

        if (result.data) {
          reactLocalStorage.setObject('user', result.data);
          initializeSession(result.data);
          dispatch(setUser(result.data));
          dispatch({ type: LOGIN_ERROR, payload: null });
        }
      }

      dispatch({ type: LOGIN_BUSY, payload: false });
    } catch (error) {
      dispatch({ type: LOGIN_BUSY, payload: false });
      dispatch({ type: LOGIN_ERROR, payload: error });
    }
  }
}

export { setUser, login };
