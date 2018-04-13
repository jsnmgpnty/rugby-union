import {
  SET_PLAYER_TO_TACKLE,
  SET_PLAYER_TO_RECEIVE_BALL,
  SET_BALL_HANDLER,
  LOCK_TURN,
  UNLOCK_TURN,
  SET_GAME_STATUS,
  GET_GAME_REQUEST_BUSY,
  SET_GAME,
  GET_GAME_REQUEST_ERROR,
  SET_CURRENT_TEAM,
  GET_ACTIVE_GAMES_SUCCESS,
  GET_ACTIVE_GAMES_ERROR,
  GET_ACTIVE_GAMES_BUSY,
  GET_GAME_STATE_BUSY,
  GET_GAME_STATE_ERROR,
  SET_SCORES,
  SET_TURN_NUMBER,
  SET_ROUND_NUMBER,
  SET_BALL_HANDLER_TEAM,
  SET_VOTES,
  SET_WINNING_TEAM,
  SET_IS_PLAYER_ON_ATTACK,
  SET_ROUND_RESULTS,
  RESET_GAME_DETAILS,
} from 'lib/actionNames';

const initialState = {
  playerToTackle: null,
  playerToReceiveBall: null,
  isBallHandler: false,
  ballHandler: null,
  ballHandlerTeam: null,
  isPlayerOnAttack: false,
  turnLocked: false,
  status: null,
  winningTeam: null,
  currentGame: null,
  currentVotes: [],
  currentTeam: null,
  currentScores: [],
  currentTurnNumber: null,
  currentRoundNumber: null,
  currentCountryName: null,
  isGetGameRequestBusy: false,
  getGameRequestError: null,
  activeGames: null,
  isGetActiveGamesBusy: false,
  getActiveGamesError: null,
  currentGameState: null,
  isGetGameStateBusy: false,
  getGameStateError: null,
  roundResults: [],
};

export default function game(state = initialState, action) {
  switch (action.type) {
    case RESET_GAME_DETAILS:
      return {
        ...initialState,
      };
    case SET_PLAYER_TO_TACKLE:
      return {
        ...state,
        playerToTackle: action.playerId,
      };
    case SET_PLAYER_TO_RECEIVE_BALL:
      return {
        ...state,
        playerToReceiveBall: action.payload,
      };
    case SET_BALL_HANDLER:
      return {
        ...state,
        isBallHandler: action.isBallHandler,
        ballHandler: action.ballHandler,
      };
    case SET_CURRENT_TEAM:
      return { ...state, currentTeam: action.payload };
    case LOCK_TURN:
      return {
        ...state,
        turnLocked: true,
      };
    case UNLOCK_TURN:
      return {
        ...state,
        turnLocked: false,
      };
    case SET_GAME_STATUS:
      return {
        ...state,
        status: action.status,
      };
    case SET_GAME:
      return { ...state, currentGame: {...state.currentGame, ...action.payload} };
    case GET_GAME_REQUEST_ERROR:
      return { ...state, getGameRequestError: action.payload };
    case GET_GAME_REQUEST_BUSY:
      return { ...state, isGetGameRequestBusy: action.payload };
    case GET_ACTIVE_GAMES_SUCCESS:
      return { ...state, activeGames: [...action.payload] };
    case GET_ACTIVE_GAMES_ERROR:
      return { ...state, getActiveGamesError: action.payload };
    case GET_ACTIVE_GAMES_BUSY:
      return { ...state, isGetActiveGamesBusy: action.payload };
    case GET_GAME_STATE_ERROR:
      return { ...state, getGameStateError: action.payload };
    case GET_GAME_STATE_BUSY:
      return { ...state, isGetGameStateBusy: action.payload };
    case SET_TURN_NUMBER:
      return { ...state, currentTurnNumber: action.payload };
    case SET_ROUND_NUMBER:
      return { ...state, currentRoundNumber: action.payload };
    case SET_BALL_HANDLER_TEAM:
      return { ...state, ballHandlerTeam: action.payload };
    case SET_VOTES:
      return { ...state, currentVotes: action.payload };
    case SET_SCORES:
      return { ...state, currentScores: action.payload };
    case SET_WINNING_TEAM:
      return { ...state, winningTeam: action.payload };
    case SET_IS_PLAYER_ON_ATTACK:
      return { ...state, isPlayerOnAttack: action.payload };
    case SET_ROUND_RESULTS:
      return {
        ...state,
        roundResults: [...state.roundResults, action.payload],
      };
    default:
      return state;
  }
}
