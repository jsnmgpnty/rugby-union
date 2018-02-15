import { 
  SET_PLAYER_TO_TACKLE,
} from 'lib/actionNames';

const setPlayerToTackle = (playerId) => ({ type: SET_PLAYER_TO_TACKLE, playerId });

export {
  setPlayerToTackle,
};
