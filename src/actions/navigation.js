import { 
  IS_CREATING_GAME,
  IS_TEAMS_SELECTED_ON_GAME_CREATE,
  IS_GAME_SELECTED_ON_LOBBY,
  IS_DELETE_ENABLED_ON_LOBBY,
  IS_GAME_WAITING_FOR_PLAYERS,
  IS_GAME_READY_TO_START,
  SET_CURRENT_PAGE,
} from 'lib/actionNames';

const isCreatingGame = (payload) => ({ type: IS_CREATING_GAME, payload });

const isTeamsSelectedOnCreateGame = (payload) => ({ type: IS_TEAMS_SELECTED_ON_GAME_CREATE, payload });

const isGameSelectedOnLobby = (payload) => ({ type: IS_GAME_SELECTED_ON_LOBBY, payload });

const isDeleteEnabledOnLobby = (payload) => ({ type: IS_DELETE_ENABLED_ON_LOBBY, payload });

const isGameWaitingForPlayers = (payload) => ({ type: IS_GAME_WAITING_FOR_PLAYERS, payload });

const isGameReadyToStart = (payload) => ({ type: IS_GAME_READY_TO_START, payload });

const setCurrentPage = (payload) => ({ type: SET_CURRENT_PAGE, payload });

export {
  isGameCreated,
  isTeamsSelectedOnCreateGame,
  isGameSelectedOnLobby,
  isDeleteEnabledOnLobby,
  isGameWaitingForPlayers,
  isGameReadyToStart,
  setCurrentPage,
};
