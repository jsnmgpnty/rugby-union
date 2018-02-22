import { SET_TEAMS, SET_GAME_NAME } from 'lib/actionNames';

const setTeams = (payload) => ({ type: SET_TEAMS, payload });

const setGameName = (payload) => ({ type: SET_GAME_NAME, payload });

export { setTeams, setGameName };
