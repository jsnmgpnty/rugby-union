import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { isPageLoading, setGame, resetNavRedirects, navigateToJoin, navigateToGamePrepare, navigateToLobby } from 'actions/navigation';
import { leaveGame, startGame, createGame } from 'actions/createGame';
import { lockTurn, passBall, tacklePlayer, transitionGame } from 'actions/game';
import { ButtonSound } from 'components';
import pageNames from 'lib/pageNames';
import './Navigator.scss';

const mapStateToProps = (state) => ({
  ...state.navigation,
  // create game state
  teams: state.createGame.teams,
  gameName: state.createGame.gameName,
  // user state
  user: state.user.user,
  currentTeam: state.user.currentTeam,
  // game state
  playerToTackle: state.game.playerToTackle,
  playerToReceiveBall: state.game.playerToReceiveBall,
  isBallHandler: state.game.isBallHandler,
  ballHandler: state.game.ballHandler,
  turnLocked: state.game.turnLocked,
  isGameTransitioning: state.game.status === 4,
  currentGame: state.game.currentGame,
});

const mapDispatchToProps = dispatch => ({
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGame: (game) => dispatch(setGame(game)),
  lockTurn: () => dispatch(lockTurn()),
  navigateToJoin: () => dispatch(navigateToJoin()),
  navigateToLobby: () => dispatch(navigateToLobby()),
  navigateToGamePrepare: () => dispatch(navigateToGamePrepare()),
  resetNavRedirects: () => dispatch(resetNavRedirects()),
  createGame: (gameName, userId, firstTeam, secondTeam) => dispatch(createGame(gameName, userId, firstTeam, secondTeam)),
  startGame: (gameId, firstTeam, secondTeam) => dispatch(startGame(gameId, firstTeam, secondTeam)),
  leaveGame: (gameId, teamId, userId) => dispatch(leaveGame(gameId, teamId, userId)),
  tacklePlayer: (gameId, userId, playerToTackle) => dispatch(tacklePlayer(gameId, userId, playerToTackle)),
  passBall: (gameId, userId, playerToReceiveBall) => dispatch(passBall(gameId, userId, playerToReceiveBall)),
  transitionGame: (gameId) => dispatch(transitionGame(gameId)),
});

class Navigator extends PureComponent {
  constructor(props) {
    super(props);

    this.onBackButtonClick = this.onBackButtonClick.bind(this);
    this.onGameStart = this.onGameStart.bind(this);
    this.onGameCreate = this.onGameCreate.bind(this);
    this.onTackle = this.onTackle.bind(this);
    this.onPassBall = this.onPassBall.bind(this);
    this.onKeepBall = this.onKeepBall.bind(this);
    this.onGameTransition = this.onGameTransition.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      resetNavRedirects();
    }
  }

  getBackButtonStyle = () => {
    const { currentPage } = this.props;
    return currentPage === pageNames.join ? 'disabled-link' : null;
  };

  getBackButtonLink = () => {
    const { currentPage } = this.props;
    return currentPage === pageNames.gameLobby ? '/join' : '/';
  };

  async onBackButtonClick() {
    const {
      currentPage,
      currentGame,
      user,
      currentTeam,
      navigateToJoin,
      navigateToLobby,
      leaveGame,
    } = this.props;

    if (currentPage === pageNames.gameLobby) {
      navigateToJoin();
    }

    if (currentPage === pageNames.gameCreate) {
      navigateToJoin();
    }

    if (currentPage === pageNames.gameDetails) {
      navigateToLobby();
    }

    if (currentPage === pageNames.gamePrepare) {
      leaveGame(currentGame.gameId, currentTeam, user.userId);
    }
  };

  async onGameStart() {
    const { startGame, currentGame } = this.props;

    if (currentGame) {
      startGame(currentGame.gameId, currentGame.teams[0].teamId, currentGame.teams[1].teamId);
    }
  };

  async onGameCreate() {
    const {
      user,
      teams,
      createGame,
      gameName,
    } = this.props;

    createGame(gameName, user.userId, teams[0], teams[1]);
  };

  onGameJoin = () => {
    this.props.navigateToGamePrepare();
  };

  async onTackle() {
    const { currentGame, user, playerToTackle, tacklePlayer } = this.props;
    tacklePlayer(currentGame.gameId, user.userId, playerToTackle);
  }

  async onPassBall() {
    const { currentGame, user, playerToReceiveBall, passBall } = this.props;
    passBall(currentGame.gameId, user.userId, playerToReceiveBall);
  }

  async onKeepBall() {
    const { currentGame, user, passBall } = this.props;
    passBall(currentGame.gameId, user.userId, user.userId);
  }

  async onGameTransition() {
    const { currentGame, transitionGame } = this.props;
    transitionGame(currentGame.gameId);
  }

  render() {
    const {
      isTeamsSelectedOnGameCreate,
      isGameSelectedOnLobby,
      isGameReadyToStart,
      currentPage,
      currentGame,
      user,
      playerToTackle,
      playerToReceiveBall,
      isBallHandler,
      ballHandler,
      turnLocked,
      isGameTransitioning,
      goToGamePrepare,
      goToLobby,
      goToJoin,
    } = this.props;

    return (
      <div id='rugby-navigator'>
        <div className='rugby-navigator__top'>
          {
            currentPage !== pageNames.join &&
            <ButtonSound color="info" onClick={this.onBackButtonClick} className={this.getBackButtonStyle()}>
              <span className="back" />
              <span className="btn-text-content">Back</span>
            </ButtonSound>
          }
        </div>
        <div className='rugby-navigator__bottom'>
          {
            currentPage === pageNames.gameCreate &&
            <ButtonSound color="success" disabled={!isTeamsSelectedOnGameCreate} onClick={this.onGameCreate}>
              <span className="create" />
              <span className="btn-text-content">Create</span>
            </ButtonSound>
          }
          { // disable view for now
            currentPage === pageNames.gameLobby && false &&
            <ButtonSound className="btn-view" color="success" disabled={!isGameSelectedOnLobby}>
              <span className="view" />
              <span className="btn-text-content">View</span>
            </ButtonSound>
          }
          {
            currentPage === pageNames.gameLobby &&
            <ButtonSound className="btn-join" onClick={this.onGameJoin} color="primary" disabled={!isGameSelectedOnLobby}>
              <span className="join" />
              <span className="btn-text-content">Join</span>
            </ButtonSound>
          }
          {
            currentPage === pageNames.gamePrepare &&
            <ButtonSound className="btn-join" onClick={this.onGameStart} color="primary" disabled={!isGameReadyToStart || user.userId !== currentGame.createdBy}>
              <span className="start" />
              <span className="btn-text-content">Start</span>
            </ButtonSound>
          }
          {
            currentPage === pageNames.gameDetails && !isGameTransitioning && !isBallHandler &&
            <ButtonSound className="btn-tackle" onClick={this.onTackle} color="success" disabled={!playerToTackle || turnLocked}>
              <span className="tackle" />
              <span className="btn-text-content">Tackle</span>
            </ButtonSound>
          }
          {
            currentPage === pageNames.gameDetails && !isGameTransitioning && isBallHandler &&
            <ButtonSound className="btn-pass" onClick={this.onPassBall} color="success" disabled={!playerToReceiveBall || turnLocked}>
              <span className="pass" />
              <span className="btn-text-content">Pass</span>
            </ButtonSound>
          }
          {
            currentPage === pageNames.gameDetails && !isGameTransitioning && isBallHandler &&
            <ButtonSound className="btn-keep" onClick={this.onKeepBall} color="primary" disabled={turnLocked || ballHandler !== user.userId}>
              <span className="keep" />
              <span className="btn-text-content">Keep</span>
            </ButtonSound>
          }
          {
            currentPage === pageNames.gameDetails && isGameTransitioning && currentGame && user.userId === currentGame.createdBy &&
            <ButtonSound className="btn-next" onClick={this.onGameTransition} color="success">
              <span className="next" />
              <span className="btn-text-content">Next</span>
            </ButtonSound>
          }
        </div>
        {
          goToGamePrepare && currentPage !== pageNames.gamePrepare && (currentGame && currentGame.gameId) && <Redirect to={`/game/${currentGame.gameId}`} key="nav-game-prepare" />
        }
        {
          goToLobby && currentPage !== pageNames.gameLobby && <Redirect to="/" key="nav-lobby" />
        }
        {
          goToJoin && currentPage !== pageNames.join && <Redirect to="/join" key="nav-join" />
        }
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigator));
export { Navigator as PlainNavigator };
