import { SET_USER, SET_CURRENT_TEAM } from 'lib/actionNames';

const setUser = user => ({ type: SET_USER, payload: user });

const setCurrentTeam = payload => ({ type: SET_CURRENT_TEAM, payload });

export { setUser, setCurrentTeam };
