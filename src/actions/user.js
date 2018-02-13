import { SET_USER } from 'lib/actionNames';

const setUser = user => ({ type: SET_USER, payload: user });

export { setUser };
