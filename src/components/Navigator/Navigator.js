import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import { isPageLoading, setGame } from 'actions/navigation';
import { lockTurn } from 'actions/game';
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
  // user state
  user: state.user.user,
  currentTeam: state.user.currentTeam,
  // game state
  playerToTackle: state.game.playerToTackle,
  playerToReceiveBall: state.game.playerToReceiveBall,
  isBallHandler: state.game.isBallHandler,
  turnLocked: state.game.turnLocked,
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
      reactLocalStorage.setObject('user', null);
      this.setState({ goToJoin: true, goToGamePrepare: false, goToLobby: false, goToGameDetails: false });
    }

    if (currentPage === pageNames.gameCreate) {
      reactLocalStorage.setObject('user', null);
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
    } = this.props;

    isPageLoading(true);

    try {
      const result = await gameApi.createGame(null, user.userId, teams[0], teams[1]);
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

  async onPassBall(playerToReceiveBall = this.props.playerToReceiveBall) {
    const { game, user } = this.props;
    this.props.lockTurn();
    await gameApi.passBall(game.gameId, user.userId, playerToReceiveBall);
  }

  async onKeepBall() {
    this.onPassBall(this.props.user.userId);
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
      turnLocked,
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
            <Button color="info" onClick={this.onBackButtonClick} className={this.getBackButtonStyle()}>
              <span className="back" />
              <span className="btn-text-content">Back</span>
            </Button>
          }
        </div>
        <div className='rugby-navigator__bottom'>
          {
            currentPage === pageNames.gameCreate &&
            <Button color="success" disabled={!isTeamsSelectedOnGameCreate} onClick={this.onGameCreate}>
              <span className="create" />
              <span className="btn-text-content">Create</span>
            </Button>
          }
          { // disable view for now
            currentPage === pageNames.gameLobby && false &&
            <Button className="btn-view" color="success" disabled={!isGameSelectedOnLobby}>
              <span className="view" />
              <span className="btn-text-content">View</span>
            </Button>
          }
          {
            currentPage === pageNames.gameLobby &&
            <Button className="btn-join" onClick={this.onGameJoin} color="primary" disabled={!isGameSelectedOnLobby}>
              <span className="join" />
              <span className="btn-text-content">Join</span>
            </Button>
          }
          {
            currentPage === pageNames.gamePrepare &&
            <Button className="btn-join" onClick={this.onGameStart} color="primary" disabled={!isGameReadyToStart || user.userId !== game.createdBy}>
              <span className="start" />
              <span className="btn-text-content">Start</span>
            </Button>
          }
          {
            currentPage === pageNames.gameDetails && !isBallHandler &&
            <Button className="btn-tackle" onClick={this.onTackle} color="success" disabled={!playerToTackle || turnLocked}>
              <span className="tackle" />
              <span className="btn-text-content">Tackle</span>
            </Button>
          }
          {
            currentPage === pageNames.gameDetails && isBallHandler &&
            <Button className="btn-pass" onClick={this.onPassBall} color="success" disabled={!playerToReceiveBall || turnLocked}>
              <span className="pass" />
              <span className="btn-text-content">Pass</span>
            </Button>
          }
          {
            currentPage === pageNames.gameDetails && isBallHandler &&
            <Button className="btn-keep" onClick={this.onKeepBall} color="success" disabled={!playerToReceiveBall || turnLocked}>
              <span className="keep" />
              <span className="btn-text-content">Keep</span>
            </Button>
          }
        </div>
        {
          goToGamePrepare && (game && game.gameId) && <Redirect to={`/game/${game.gameId}`} />
        }
        {
          goToLobby && <Redirect to="/" />
        }
        {
          goToJoin && <Redirect to="/join" />
        }
        {
          goToGameDetails && <Redirect to={`/game/${game.gameId}/details`} />
        }
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigator));
export { Navigator as PlainNavigator };
