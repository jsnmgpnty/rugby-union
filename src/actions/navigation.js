import {
  IS_TEAMS_SELECTED_ON_GAME_CREATE,
  IS_GAME_SELECTED_ON_LOBBY,
  IS_DELETE_ENABLED_ON_LOBBY,
  IS_GAME_WAITING_FOR_PLAYERS,
  IS_GAME_READY_TO_START,
  IS_PAGE_LOADING,
  SET_CURRENT_PAGE,
  SET_GAME,
  SET_PLAYER_AVATAR,
  GO_TO_GAMEPREPARE,
  GO_TO_LOBBY,
  GO_TO_JOIN,
  RESET_NAV_REDIRECTS,
  SET_USER,
} from 'lib/actionNames';

const isTeamsSelectedOnGameCreate = (payload) => ({ type: IS_TEAMS_SELECTED_ON_GAME_CREATE, payload });

const isGameSelectedOnLobby = (payload) => ({ type: IS_GAME_SELECTED_ON_LOBBY, payload });

const isDeleteEnabledOnLobby = (payload) => ({ type: IS_DELETE_ENABLED_ON_LOBBY, payload });

const isGameWaitingForPlayers = (payload) => ({ type: IS_GAME_WAITING_FOR_PLAYERS, payload });

const isGameReadyToStart = (payload) => ({ type: IS_GAME_READY_TO_START, payload });

const isPageLoading = (payload) => ({ type: IS_PAGE_LOADING, payload });

const setCurrentPage = (payload) => ({ type: SET_CURRENT_PAGE, payload });

const setGame = (payload) => ({ type: SET_GAME, payload });

const setPlayerAvatar = (payload) => ({ type: SET_PLAYER_AVATAR, payload });

const navigateToJoin = () => {
  return (dispatch) => {
    dispatch({ type: SET_USER, payload: null });
    dispatch({ type: GO_TO_JOIN });
  };
};

const navigateToGamePrepare = () => {
  return (dispatch) => {
    dispatch({ type: GO_TO_GAMEPREPARE });
  };
};

const navigateToLobby = () => {
  return (dispatch) => {
    dispatch({ type: GO_TO_LOBBY });
  };
};

const resetNavRedirects = () => ({ type: RESET_NAV_REDIRECTS });

export {
  isTeamsSelectedOnGameCreate,
  isGameSelectedOnLobby,
  isDeleteEnabledOnLobby,
  isGameWaitingForPlayers,
  isGameReadyToStart,
  isPageLoading,
  setCurrentPage,
  setGame,
  setPlayerAvatar,
  navigateToGamePrepare,
  navigateToJoin,
  navigateToLobby,
  resetNavRedirects,
};
