import { 
  IS_TEAMS_SELECTED_ON_GAME_CREATE,
  IS_GAME_SELECTED_ON_LOBBY,
  IS_DELETE_ENABLED_ON_LOBBY,
  IS_GAME_WAITING_FOR_PLAYERS,
  IS_GAME_READY_TO_START,
  IS_PAGE_LOADING,
  SET_CURRENT_PAGE,
  SET_GAME_ID,
  SET_PLAYER_AVATAR,
} from 'lib/actionNames';

const isTeamsSelectedOnGameCreate = (payload) => ({ type: IS_TEAMS_SELECTED_ON_GAME_CREATE, payload });

const isGameSelectedOnLobby = (payload) => ({ type: IS_GAME_SELECTED_ON_LOBBY, payload });

const isDeleteEnabledOnLobby = (payload) => ({ type: IS_DELETE_ENABLED_ON_LOBBY, payload });

const isGameWaitingForPlayers = (payload) => ({ type: IS_GAME_WAITING_FOR_PLAYERS, payload });

const isGameReadyToStart = (payload) => ({ type: IS_GAME_READY_TO_START, payload });

const isPageLoading = (payload) => ({ type: IS_PAGE_LOADING, payload });

const setCurrentPage = (payload) => ({ type: SET_CURRENT_PAGE, payload });

const setGameId = (payload) => ({ type: SET_GAME_ID, payload });

const setPlayerAvatar = (payload) => ({ type: SET_PLAYER_AVATAR, payload });

export {
  isTeamsSelectedOnGameCreate,
  isGameSelectedOnLobby,
  isDeleteEnabledOnLobby,
  isGameWaitingForPlayers,
  isGameReadyToStart,
  isPageLoading,
  setCurrentPage,
  setGameId,
  setPlayerAvatar,
};
