import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import { reactLocalStorage } from 'reactjs-localstorage';

import pageNames from 'lib/pageNames';
import { onGameLeave } from 'services/SocketClient';
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

class Navigator extends Component {
  getBackButtonStyle = () => {
    const { currentPage } = this.props;
    return currentPage === pageNames.join ? 'disabled-link' : null;
  };

  getBackButtonLink = () => {
    const { currentPage } = this.props;
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

  render() {
    const {
      isCreatingGame,
      isTeamsSelectedOnGameCreate,
      isGameSelectedOnLobby,
      isDeleteEnabledOnLobby,
      isGameWaitingForPlayers,
      isGameReadyToStart,
      currentPage,
    } = this.props;

    return (
      <div id='rugby-navigator'>
        <div className='rugby-navigator__top'>
          {
            currentPage !== pageNames.join &&
            <Link to={this.getBackButtonLink()} className={this.getBackButtonStyle()}>
              <Button color="info" onClick={this.onBackButtonClick}>
                <span className="back" />
                <span className="btn-text-content">Back</span>
              </Button>
            </Link>
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
          {
            currentPage === pageNames.gameLobby &&
            <Button className="btn-view" color="success" disabled={!isGameSelectedOnLobby}>
              <span className="view" />
              <span className="btn-text-content">View</span>
            </Button>
          }
          {
            currentPage === pageNames.gameLobby &&
            <Button className="btn-join" color="primary" disabled={!isGameSelectedOnLobby}>
              <span className="join" />
              <span className="btn-text-content">Join</span>
            </Button>
          }
          {
            currentPage === pageNames.gamePrepare &&
            <Button className="btn-join" color="primary" disabled={!isGameReadyToStart}>
              <span className="start" />
              <span className="btn-text-content">Start</span>
            </Button>
          }
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(Navigator));
export { Navigator as PlainNavigator };
