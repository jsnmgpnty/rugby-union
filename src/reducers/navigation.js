import {
  IS_CREATING_GAME,
  IS_TEAMS_SELECTED_ON_GAME_CREATE,
  IS_IN_LOBBY,
  IS_GAME_SELECTED_ON_LOBBY,
  IS_DELETE_ENABLED_ON_LOBBY,
  IS_GAME_WAITING_FOR_PLAYERS,
  IS_GAME_READY_TO_START,
  SET_CURRENT_PAGE,
} from 'lib/actionNames';

const initialState = {
  isTeamsSelectedOnGameCreate: false,
  isGameSelectedOnLobby: false,
  isDeleteEnabledOnLobby: false,
  isGameWaitingForPlayers: false,
  isGameReadyToStart: false,
  currentPage: null,
};

const navigation = (state = initialState, action) => {
  switch (action.type) {
    case IS_TEAMS_SELECTED_ON_GAME_CREATE:
      return {
        ...state,
        isTeamsSelectedOnGameCreate: action.payload,
        isGameSelectedOnLobby: false,
        isDeleteEnabledOnLobby: false,
        isGameWaitingForPlayers: false,
        isGameReadyToStart: false,
      };
    case IS_GAME_SELECTED_ON_LOBBY:
      return {
        ...state,
        isTeamsSelectedOnGameCreate: false,
        isGameSelectedOnLobby: action.payload,
        isDeleteEnabledOnLobby: false,
        isGameWaitingForPlayers: false,
        isGameReadyToStart: false,
      };
    case IS_DELETE_ENABLED_ON_LOBBY:
      return {
        ...state,
        isTeamsSelectedOnGameCreate: false,
        isGameSelectedOnLobby: false,
        isDeleteEnabledOnLobby: action.payload,
        isGameWaitingForPlayers: false,
        isGameReadyToStart: false,
      };
    case IS_GAME_WAITING_FOR_PLAYERS:
      return {
        ...state,
        isTeamsSelectedOnGameCreate: false,
        isGameSelectedOnLobby: false,
        isDeleteEnabledOnLobby: false,
        isGameWaitingForPlayers: action.payload,
        isGameReadyToStart: false,
      };
    case IS_GAME_READY_TO_START:
      return {
        ...state,
        isTeamsSelectedOnGameCreate: false,
        isGameSelectedOnLobby: false,
        isDeleteEnabledOnLobby: false,
        isGameWaitingForPlayers: false,
        isGameReadyToStart: action.payload,
      };
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
};

export default navigation;
