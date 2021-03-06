import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import { isPageLoading, setGame } from 'actions/navigation';
import { lockTurn } from 'actions/game';
import { ButtonSound } from 'components';
import pageNames from 'lib/pageNames';
import gameApi from 'services/GameApi';
import './Navigator.scss';

const mapStateToProps = (state) => ({
  isCreatingGame: state.navigation.isCreatingGame,
  isTeamsSelectedOnGameCreate: state.navigation.isTeamsSelectedOnGameCreate,
  isGameSelectedOnLobby: state.navigation.isGameSelectedOnLobby,
  isDeleteEnabledOnLobby: state.navigation.isDeleteEnabledOnLobby,
  isGameWaitingForPlayers: state.navigation.isGameWaitingForPlayers,
  isGameReadyToStart: state.navigation.isGameReadyToStart,
  currentPage: state.navigation.currentPage,
  game: state.navigation.game,
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
});

const mapDispatchToProps = dispatch => ({
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGame: (game) => dispatch(setGame(game)),
  lockTurn: () => dispatch(lockTurn()),
});

class Navigator extends PureComponent {
  state = {
    goToGamePrepare: false,
    goToLobby: false,
    goToJoin: false,
    goToGameDetails: false,
  };

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
    // reset state of navigation redirects
    this.setState({ goToJoin: false, goToGamePrepare: false, goToLobby: false, goToGameDetails: false });
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
    const { currentPage, game, user, currentTeam } = this.props;

    if (currentPage === pageNames.gameLobby) {
      this.setState({ goToJoin: true, goToGamePrepare: false, goToLobby: false, goToGameDetails: false });
    }

    if (currentPage === pageNames.gameCreate) {
      this.setState({ goToJoin: true, goToGamePrepare: false, goToLobby: false, goToGameDetails: false });
    }

    if (currentPage === pageNames.gameDetails) {
      this.setState({ goToJoin: false, goToGamePrepare: false, goToLobby: true, goToGameDetails: false });
    }

    if (currentPage === pageNames.gamePrepare) {
      isPageLoading(true);

      try {
        const result = await gameApi.leaveGame(game.gameId, currentTeam, user.userId);
        if (result && result.isSuccess) {
          this.setState({ goToGameDetails: false, goToGamePrepare: false, goToJoin: false, goToLobby: true });
        }
        isPageLoading(false);
      } catch (error) {
        isPageLoading(false);
      }
    }
  };

  async onGameStart() {
    const {
      game,
      isPageLoading,
    } = this.props;

    isPageLoading(true);

    try {
      const result = await gameApi.startGame(game.gameId, game.teams[0].teamId, game.teams[1].teamId);
      if (result && result.game) {
        setGame(result.game);
        this.setState({ goToGameDetails: true, goToGamePrepare: false, goToJoin: false, goToLobby: false });
      }
      isPageLoading(false);
    } catch (error) {
      isPageLoading(false);
    }
  };

  async onGameCreate() {
    const {
      user,
      teams,
      isPageLoading,
      setGame,
      gameName,
    } = this.props;

    isPageLoading(true);

    try {
      const result = await gameApi.createGame(gameName, user.userId, teams[0], teams[1]);
      if (result && result.isSuccess) {
        setGame(result.data);
        this.setState({ goToGameDetails: false, goToGamePrepare: true, goToJoin: false, goToLobby: false });
      }
      isPageLoading(false);
    } catch (error) {
      isPageLoading(false);
    }
  };

  onGameJoin = () => {
    this.setState({ goToGamePrepare: true, goToLobby: false, goToJoin: false, goToGameDetails: false });
  };

  async onTackle() {
    const { game, user, playerToTackle } = this.props;
    this.props.lockTurn();
    await gameApi.tacklePlayer(game.gameId, user.userId, playerToTackle);
  }

  async onPassBall() {
    const { game, user } = this.props;
    this.props.lockTurn();
    await gameApi.passBall(game.gameId, user.userId, this.props.playerToReceiveBall);
  }

  async onKeepBall() {
    const { game, user } = this.props;
    this.props.lockTurn();
    await gameApi.passBall(game.gameId, user.userId, this.props.user.userId);
  }

  async onGameTransition() {
    await gameApi.transitionGame(this.props.game.gameId);
  }

  render() {
    const {
      isTeamsSelectedOnGameCreate,
      isGameSelectedOnLobby,
      isGameReadyToStart,
      currentPage,
      game,
      user,
      playerToTackle,
      playerToReceiveBall,
      isBallHandler,
      ballHandler,
      turnLocked,
      isGameTransitioning,
    } = this.props;

    const {
      goToGamePrepare,
      goToLobby,
      goToJoin,
      goToGameDetails,
    } = this.state;

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
            <ButtonSound className="btn-join" onClick={this.onGameStart} color="primary" disabled={!isGameReadyToStart || user.userId !== game.createdBy}>
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
            currentPage === pageNames.gameDetails && isGameTransitioning && game && user.userId === game.createdBy &&
            <ButtonSound className="btn-next" onClick={this.onGameTransition} color="success">
              <span className="next" />
              <span className="btn-text-content">Next</span>
            </ButtonSound>
          }
        </div>
        {
          goToGamePrepare && (game && game.gameId) && <Redirect to={`/game/${game.gameId}`} key="nav-game-prepare" />
        }
        {
          goToLobby && <Redirect to="/" key="nav-lobby" />
        }
        {
          goToJoin && <Redirect to="/join" key="nav-join" />
        }
        {
          goToGameDetails && <Redirect to={`/game/${game.gameId}/details`} key="nav-game-details" />
        }
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigator));
export { Navigator as PlainNavigator };
