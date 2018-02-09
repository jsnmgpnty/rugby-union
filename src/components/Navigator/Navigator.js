import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import { isPageLoading, setGameId } from 'actions/navigation';
import pageNames from 'lib/pageNames';
import { onGameLeave, onGameStart } from 'services/SocketClient';
import './Navigator.scss';

const mapStateToProps = (state) => ({
  isCreatingGame: state.navigation.isCreatingGame,
  isTeamsSelectedOnGameCreate: state.navigation.isTeamsSelectedOnGameCreate,
  isGameSelectedOnLobby: state.navigation.isGameSelectedOnLobby,
  isDeleteEnabledOnLobby: state.navigation.isDeleteEnabledOnLobby,
  isGameWaitingForPlayers: state.navigation.isGameWaitingForPlayers,
  isGameReadyToStart: state.navigation.isGameReadyToStart,
  currentPage: state.navigation.currentPage,
  gameId: state.navigation.gameId,
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  isPageLoading: (isLoading) => dispatch(isPageLoading(isLoading)),
  setGameId: (gameId) => dispatch(setGameId(gameId)),
});

class Navigator extends Component {
  state = {
    goToGamePrepare: false,
    goToLobby: false,
  };

  getBackButtonStyle = () => {
    const { currentPage } = this.props;
    return currentPage === pageNames.join ? 'disabled-link' : null;
  };

  getBackButtonLink = () => {
    const { currentPage, setGameId } = this.props;
    return currentPage === pageNames.gameLobby ? '/join' : '/';
  };

  onBackButtonClick = () => {
    const { currentPage, gameId, user } = this.props;

    if (currentPage === pageNames.gameLobby) {
      reactLocalStorage.setObject('user', null);
    }

    if (currentPage === pageNames.gamePrepare) {
      onGameLeave({
        username: user.username,
        gameId: gameId,
      });
    }
  };

  onGameStart = () => {
    const {
      gameId,
      isPageLoading,
    } = this.props;

    isPageLoading(true);

    const requestPayload = { gameId };
    onGameStart(requestPayload);
  };

  onGameJoin = () => {
    this.setState({ goToGamePrepare: true, goToLobby: false });
  }

  render() {
    const {
      isCreatingGame,
      isTeamsSelectedOnGameCreate,
      isGameSelectedOnLobby,
      isDeleteEnabledOnLobby,
      isGameWaitingForPlayers,
      isGameReadyToStart,
      currentPage,
      gameId,
    } = this.props;

    const {
      goToGamePrepare,
      goToLobby,
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
            <Button color="success" disabled={!isTeamsSelectedOnGameCreate}>
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
            <Button className="btn-join" onClick={this.onGameStart} color="primary" disabled={!isGameReadyToStart}>
              <span className="start" />
              <span className="btn-text-content">Start</span>
            </Button>
          }
        </div>
        {
          goToGamePrepare && gameId && <Redirect to={`/game/${gameId}`} />
        }
        {
          goToLobby && <Redirect to="/" />
        }
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigator));
export { Navigator as PlainNavigator };
