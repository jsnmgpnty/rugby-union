import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import { isPageLoading, setGame } from 'actions/navigation';
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
  user: state.user.user,
  teams: state.createGame.teams,
  currentTeam: state.user.currentTeam,
});

const mapDispatchToProps = dispatch => ({
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGame: (game) => dispatch(setGame(game)),
});

class Navigator extends Component {
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
      this.setState({ goToJoin: true, goToGamePrepare: false, goToLobby: false });
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
      teams,
    } = this.props;

    isPageLoading(true);

    try {
      const result = await gameApi.startGame(game.gameId, teams[0], teams[1]);
      if (result && result.isSuccess) {
        setGame(result.data);
        this.setState({ goToGameDetails: true, goToGamePrepare: false, goToJoin: false, goToLobby: false });
      }
      isPageLoading(false);
    } catch (error) {
      isPageLoading(false);
    }
  };

  async onGameCreate() {
    const {
      game,
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
    this.setState({ goToGamePrepare: true, goToLobby: false, goToJoin: false });
  };

  render() {
    const {
      isCreatingGame,
      isTeamsSelectedOnGameCreate,
      isGameSelectedOnLobby,
      isDeleteEnabledOnLobby,
      isGameWaitingForPlayers,
      isGameReadyToStart,
      currentPage,
      game,
      user,
    } = this.props;

    const {
      goToGamePrepare,
      goToLobby,
      goToJoin,
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
            <Button className="btn-join" onClick={this.onGameStart} color="primary" disabled={!isGameReadyToStart || user.username !== game.createdBy}>
              <span className="start" />
              <span className="btn-text-content">Start</span>
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
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigator));
export { Navigator as PlainNavigator };
